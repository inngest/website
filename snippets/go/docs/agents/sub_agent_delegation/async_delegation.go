package sub_agent_delegation

import (
	"context"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ParentTask struct {
	SessionID   string `json:"sessionId"`
	CallbackURL string `json:"callbackUrl"`
}

func asyncDelegation(ctx context.Context, input inngestgo.Input[ParentTask], toolCall ToolCall) (string, error) {
	var toolResult string
	// !snippet:start
	if toolCall.Name == "delegate_background_task" {
		_, err := step.Send(ctx, "spawn-background-task", inngestgo.Event{
			Name: "agent/sub-agent.spawn",
			Data: map[string]any{
				"task":      toolCall.Arguments["task"],
				"sessionId": fmt.Sprintf("sub-%s-%d", input.Event.Data.SessionID, time.Now().UnixMilli()),
				"isAsync":   true,
				"replyTo": map[string]any{
					"type": "webhook",
					"url":  input.Event.Data.CallbackURL,
				},
			},
		})
		if err != nil {
			return "", err
		}

		toolResult = "Task delegated. The sub-agent is working on it in the background."
	}
	// !snippet:end
	return toolResult, nil
}
