package sub_agent_delegation

// !snippet:start
import (
	"context"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type TaskReceived struct {
	SessionID string `json:"sessionId"`
}

func ParentAgent(client inngestgo.Client, subAgent inngestgo.ServableFunction) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "parent-agent"},
		inngestgo.EventTrigger("agent/task.received", nil),
		func(ctx context.Context, input inngestgo.Input[TaskReceived]) (any, error) {
			messages := []Message{{Role: "system", Content: SYSTEM_PROMPT}}
			done := false
			i := 0

			for !done && i < 30 {
				response, err := step.Run(ctx, "think", func(ctx context.Context) (LLMResponse, error) {
					return callLLM(ctx, messages, TOOLS)
				})
				if err != nil {
					return nil, err
				}

				for _, toolCall := range response.ToolCalls {
					var toolResult string

					if toolCall.Name == "delegate_task" {
						// Synchronous delegation — parent waits for the result
						subResult, err := step.Invoke[AgentResult](ctx, "sub-agent", step.InvokeOpts{
							FunctionId: subAgent.FullyQualifiedID(),
							Data: map[string]any{
								"task":      toolCall.Arguments["task"],
								"sessionId": fmt.Sprintf("sub-%s-%d", input.Event.Data.SessionID, time.Now().UnixMilli()),
							},
						})
						if err != nil {
							return nil, err
						}

						toolResult = subResult.Response
						if toolResult == "" {
							toolResult = "(no response from sub-agent)"
						}
					} else {
						toolResult, err = step.Run(ctx, "tool-"+toolCall.Name, func(ctx context.Context) (string, error) {
							return executeTool(ctx, toolCall.Name, toolCall.Arguments)
						})
						if err != nil {
							return nil, err
						}
					}

					messages = append(messages,
						Message{Role: "assistant", ToolCalls: []ToolCall{toolCall}},
						Message{Role: "tool", ToolCallID: toolCall.ID, Content: toolResult},
					)
				}

				if len(response.ToolCalls) == 0 {
					done = true
				}
				i++
			}

			return map[string]any{"response": messages[len(messages)-1].Content}, nil
		},
	)
}

// !snippet:end
