package stream_ai_responses

// !snippet:start
import (
	"context"
	"encoding/json"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/realtime"
	"github.com/inngest/inngestgo/step"
)

const model = "gpt-5"

type PromptSubmitted struct {
	ThreadID string `json:"threadId"`
	Prompt   string `json:"prompt"`
}

type Generated struct {
	Text         string `json:"text"`
	OutputTokens int    `json:"outputTokens"`
}

func publishJSON(ctx context.Context, channel, topic string, v any) error {
	data, err := json.Marshal(v)
	if err != nil {
		return err
	}
	return realtime.Publish(ctx, channel, topic, data)
}

func RegisterGenerate(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "generate-response"},
		inngestgo.EventTrigger("app/prompt.submitted", nil),
		func(ctx context.Context, input inngestgo.Input[PromptSubmitted]) (any, error) {
			// One channel per conversation thread.
			ch := "ai-thread:" + input.Event.Data.ThreadID

			// Outside a step: sent once, not repeated on replay or retry.
			if err := publishJSON(ctx, ch, "status", map[string]any{
				"message":  "Generating response...",
				"progress": 0,
			}); err != nil {
				return nil, err
			}

			generated, err := step.Run(ctx, "stream-model", func(ctx context.Context) (Generated, error) {
				text := ""
				// streamCompletion calls your model provider's streaming API
				// and invokes the callback for each text delta.
				outputTokens, err := streamCompletion(ctx, model, input.Event.Data.Prompt, func(delta string) error {
					text += delta
					// Inside a step: one publish per token. A retry of the
					// step can repeat tokens.
					return publishJSON(ctx, ch, "tokens", map[string]string{"token": delta})
				})
				return Generated{Text: text, OutputTokens: outputTokens}, err
			})
			if err != nil {
				return nil, err
			}

			// Outside a step, after the last step: sent once.
			return nil, publishJSON(ctx, ch, "result", map[string]any{
				"output":       generated.Text,
				"model":        model,
				"outputTokens": generated.OutputTokens,
			})
		},
	)
}

// !snippet:end
