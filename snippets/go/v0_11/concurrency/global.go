package concurrency

import (
	"context"

	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

func GlobalSnippet() error {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "func-a",
			Concurrency: []inngestgo.ConfigStepConcurrency{
				{
					Scope: enums.ConcurrencyScopeAccount,
					Key:   inngestgo.StrPtr(`"openai"`),
					Limit: 5,
				},
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			return nil, nil
		},
	)
	if err != nil {
		return err
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "func-b",
			Concurrency: []inngestgo.ConfigStepConcurrency{
				{
					Scope: enums.ConcurrencyScopeAccount,
					Key:   inngestgo.StrPtr(`"openai"`),
					Limit: 50,
				},
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			return nil, nil
		},
	)
	if err != nil {
		return err
	}
	// !snippet:end

	return nil
}
