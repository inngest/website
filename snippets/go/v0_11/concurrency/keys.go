package concurrency

import (
	"context"

	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

func KeysSnippet() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "generate-ai-summary",
			Concurrency: []inngestgo.ConfigStepConcurrency{
				{
					Scope: enums.ConcurrencyScopeFn,
					Key:   inngestgo.StrPtr("event.data.account_id"),
					Limit: 10,
				},
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// Your function handler here
			return nil, nil
		},
	)
	// !snippet:end

	_ = err
}
