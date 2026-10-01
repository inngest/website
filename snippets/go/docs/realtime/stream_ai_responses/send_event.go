package stream_ai_responses

// !snippet:start
import (
	"context"
	"crypto/rand"

	"github.com/inngest/inngestgo"
)

func startWorkflow(ctx context.Context, client inngestgo.Client) (string, error) {
	threadID := rand.Text()

	_, err := client.Send(ctx, inngestgo.Event{
		Name: "app/prompt.submitted",
		Data: map[string]any{
			"threadId": threadID,
			"prompt":   "Summarize the key points of this document...",
		},
	})
	return threadID, err
}

// !snippet:end

var _ = startWorkflow
