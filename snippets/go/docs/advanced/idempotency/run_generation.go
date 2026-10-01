package idempotency

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
)

func RunGeneration(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "run-generation",
			// Given the event payload sends a hash of the prompt,
			// this will only run once per unique prompt per user
			// every 24 hours:
			Idempotency: inngestgo.StrPtr(`event.data.promptHash + "-" + event.data.userId`),
		},
		inngestgo.EventTrigger("ai/generation.requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// Track the request
			return nil, nil
		},
	)
}

// !snippet:end
