package sub_agent_delegation

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ResultEventSpawn struct {
	SessionID       string `json:"sessionId"`
	ParentSessionID string `json:"parentSessionId"`
	IsAsync         bool   `json:"isAsync"`
}

func resultEvent(ctx context.Context, input inngestgo.Input[ResultEventSpawn], result AgentResult) error {
	isAsync := input.Event.Data.IsAsync
	sessionID := input.Event.Data.SessionID
	// !snippet:start
	// Sub-agent emits result as an event
	if isAsync {
		_, err := step.Send(ctx, "result-ready", inngestgo.Event{
			Name: "agent/sub-agent.completed",
			Data: map[string]any{
				"sessionId":       sessionID,
				"parentSessionId": input.Event.Data.ParentSessionID,
				"response":        result.Response,
			},
		})
		if err != nil {
			return err
		}
	}
	// !snippet:end
	return nil
}
