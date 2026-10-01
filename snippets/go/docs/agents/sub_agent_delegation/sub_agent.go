package sub_agent_delegation

// !snippet:start
import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
)

type SubAgentSpawn struct {
	Task      string `json:"task"`
	SessionID string `json:"sessionId"`
}

func SubAgent(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "sub-agent"},
		inngestgo.EventTrigger("agent/sub-agent.spawn", nil),
		func(ctx context.Context, input inngestgo.Input[SubAgentSpawn]) (any, error) {
			systemPrompt := fmt.Sprintf("You are a focused sub-agent. Complete the following task and return a clear, concise result.\n\nTask: %s", input.Event.Data.Task)

			result, err := runAgentLoop(ctx, AgentLoopOpts{
				SystemPrompt:  systemPrompt,
				SessionID:     input.Event.Data.SessionID,
				Tools:         SUB_AGENT_TOOLS, // No delegation tools — see "Prevent recursion"
				MaxIterations: 20,
			})
			if err != nil {
				return nil, err
			}

			return AgentResult{
				Response:   result.Response,
				Iterations: result.Iterations,
			}, nil
		},
	)
}

// !snippet:end
