package sub_agent_delegation

// !snippet:start
import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
)

func SubAgentWithLimits(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "sub-agent", Retries: inngestgo.IntPtr(1)},
		inngestgo.EventTrigger("agent/sub-agent.spawn", nil),
		func(ctx context.Context, input inngestgo.Input[SubAgentSpawn]) (any, error) {
			return runAgentLoop(ctx, AgentLoopOpts{
				SystemPrompt:  fmt.Sprintf("Complete this task:\n\n%s", input.Event.Data.Task),
				SessionID:     input.Event.Data.SessionID,
				Tools:         SUB_AGENT_TOOLS, // Restricted — always
				MaxIterations: 20,              // Hard cap on iterations
			})
		},
	)
}

// !snippet:end
