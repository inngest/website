package sub_agent_delegation

// !snippet:start
import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type AsyncSubAgentSpawn struct {
	Task      string `json:"task"`
	SessionID string `json:"sessionId"`
	IsAsync   bool   `json:"isAsync"`
	ReplyTo   *struct {
		Type string `json:"type"`
		URL  string `json:"url"`
	} `json:"replyTo"`
}

func SubAgentAsync(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "sub-agent"},
		inngestgo.EventTrigger("agent/sub-agent.spawn", nil),
		func(ctx context.Context, input inngestgo.Input[AsyncSubAgentSpawn]) (any, error) {
			data := input.Event.Data

			result, err := runAgentLoop(ctx, AgentLoopOpts{
				SystemPrompt:  fmt.Sprintf("Complete this task:\n\n%s", data.Task),
				SessionID:     data.SessionID,
				Tools:         SUB_AGENT_TOOLS,
				MaxIterations: 30,
			})
			if err != nil {
				return nil, err
			}

			if data.IsAsync && data.ReplyTo != nil {
				_, err := step.Run(ctx, "deliver-result", func(ctx context.Context) (any, error) {
					if data.ReplyTo.Type != "webhook" {
						return nil, nil
					}
					body, _ := json.Marshal(map[string]any{"response": result.Response})
					req, err := http.NewRequestWithContext(ctx, http.MethodPost, data.ReplyTo.URL, bytes.NewReader(body))
					if err != nil {
						return nil, err
					}
					req.Header.Set("Content-Type", "application/json")
					resp, err := http.DefaultClient.Do(req)
					if err != nil {
						return nil, err
					}
					return nil, resp.Body.Close()
				})
				if err != nil {
					return nil, err
				}
			}

			return result, nil
		},
	)
}

// !snippet:end
