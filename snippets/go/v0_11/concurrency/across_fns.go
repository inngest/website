package concurrency

import (
	"context"

	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

func AcrossFnsSnippet() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "generate-ai-summary",
			Concurrency: []inngestgo.ConfigStepConcurrency{
				{
					Scope: enums.ConcurrencyScopeAccount,
					Key:   inngestgo.StrPtr(`"openai"`),
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
