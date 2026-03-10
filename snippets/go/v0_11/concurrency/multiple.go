package concurrency

import (
	"context"

	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

func MultipleSnippet() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "generate-ai-summary",
			Concurrency: []inngestgo.ConfigStepConcurrency{
				{
					// Use an account-level concurrency limit for this function, using the
					// "openai" key as a virtual queue. Any other function which
					// runs using the same "openai" key counts towards this limit.
					Scope: enums.ConcurrencyScopeAccount,
					Key:   inngestgo.StrPtr(`"openai"`),
					Limit: 10,
				},
				{
					// Create another virtual concurrency queue for this function only. This
					// limits all accounts to a single execution for this function, based off
					// of the `event.data.account_id` field.
					// NOTE - "fn" is the default scope, so we could omit this field.
					Scope: enums.ConcurrencyScopeFn,
					Key:   inngestgo.StrPtr("event.data.account_id"),
					Limit: 1,
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
