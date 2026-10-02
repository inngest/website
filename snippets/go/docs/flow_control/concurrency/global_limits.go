package concurrency

import (
	"context"

	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

func RegisterGlobalLimitFunctions(client inngestgo.Client) error {
	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "func-a",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{
					{
						Scope: enums.ConcurrencyScopeAccount,
						Key:   inngestgo.StrPtr(`"openai"`),
						Limit: 5,
					},
				},
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[any]) (any, error) {
			return nil, nil
		},
	)
	if err != nil {
		return err
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "func-b",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{
					{
						Scope: enums.ConcurrencyScopeAccount,
						Key:   inngestgo.StrPtr(`"openai"`),
						Limit: 50,
					},
				},
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[any]) (any, error) {
			return nil, nil
		},
	)
	// !snippet:end
	return err
}
