package stream_ai_responses

import "context"

// streamCompletion stands in for a model provider's streaming API.
func streamCompletion(ctx context.Context, model, prompt string, onDelta func(string) error) (int, error) {
	return 0, onDelta(prompt)
}
