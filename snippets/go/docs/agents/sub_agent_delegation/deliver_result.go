package sub_agent_delegation

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type SubAgentCompleted struct {
	Response        string `json:"response"`
	ParentSessionID string `json:"parentSessionId"`
}

// Separate function handles result delivery
func DeliverSubAgentResult(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "deliver-sub-agent-result"},
		inngestgo.EventTrigger("agent/sub-agent.completed", nil),
		func(ctx context.Context, input inngestgo.Input[SubAgentCompleted]) (any, error) {
			_, err := step.Run(ctx, "deliver", func(ctx context.Context) (any, error) {
				return nil, notifyUser(ctx, input.Event.Data.ParentSessionID, input.Event.Data.Response)
			})
			return nil, err
		},
	)
}

// !snippet:end
