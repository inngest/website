package idempotency

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
)

func TrackRequests(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "track-requests"},
		inngestgo.EventTrigger("ai/generation.requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// Track the request
			return nil, nil
		},
	)
}

// !snippet:end
