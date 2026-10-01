package human_in_the_loop

// !snippet:start
import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"slices"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

var approvalRequiredTools = []string{"send_email", "delete_record", "run_sql", "deploy"}

type TaskReceived struct {
	Task   string `json:"task"`
	TaskID string `json:"taskId"`
}

func AgentWithApproval(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "agent-with-approval"},
		inngestgo.EventTrigger("agent/task.received", nil),
		func(ctx context.Context, input inngestgo.Input[TaskReceived]) (any, error) {
			messages := []Message{{Role: "user", Content: input.Event.Data.Task}}
			iterations := 0

			for iterations < 20 {
				iterations++

				llmResponse, err := step.Run(ctx, "think", func(ctx context.Context) (LLMResponse, error) {
					return callLLM(ctx, messages, allTools)
				})
				if err != nil {
					return nil, err
				}

				if len(llmResponse.ToolCalls) == 0 {
					return map[string]any{"response": llmResponse.Text, "iterations": iterations}, nil
				}

				for _, toolCall := range llmResponse.ToolCalls {
					if slices.Contains(approvalRequiredTools, toolCall.Name) {
						// Create a unique approval ID that will not be re-used
						approvalID := fmt.Sprintf("%s-%d-%s", input.Event.Data.TaskID, iterations, toolCall.Name)

						_, err := step.Run(ctx, "request-approval-"+approvalID, func(ctx context.Context) (any, error) {
							args, _ := json.MarshalIndent(toolCall.Arguments, "", "  ")
							return nil, sendSlackMessage(ctx, SlackMessage{
								Channel: "#agent-approvals",
								Text:    fmt.Sprintf("🔒 *Agent wants to execute: `%s`*\n```%s```", toolCall.Name, args),
							})
						})
						if err != nil {
							return nil, err
						}

						approval, err := step.WaitForEvent[inngestgo.GenericEvent[ApprovalResponse]](
							ctx,
							"wait-approval-"+approvalID,
							step.WaitForEventOpts{
								Event:   "agent/approval.response",
								If:      inngestgo.StrPtr("async.data.approvalId == event.data.approvalId"),
								Timeout: 4 * time.Hour,
							},
						)
						if err != nil && !errors.Is(err, step.ErrEventNotReceived) {
							return nil, err
						}

						if !approval.Data.Approved {
							reason := approval.Data.Reason
							if reason == "" {
								reason = "No response / timed out"
							}
							messages = append(messages, Message{
								Role:    "tool",
								Content: fmt.Sprintf("Tool call rejected by human reviewer. Reason: %s. Choose a different approach.", reason),
							})
							continue
						}
					}

					result, err := step.Run(ctx, "tool-"+toolCall.Name, func(ctx context.Context) (string, error) {
						return executeTool(ctx, toolCall.Name, toolCall.Arguments)
					})
					if err != nil {
						return nil, err
					}

					messages = append(messages, Message{Role: "tool", Content: result})
				}
			}

			return map[string]any{"status": "max_iterations_reached"}, nil
		},
	)
}

// !snippet:end
