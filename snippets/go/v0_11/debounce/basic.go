package debounce

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
)

func BasicSnippet() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "handle-webhook",
			Debounce: &inngestgo.ConfigDebounce{
				Key:     "event.data.account_id",
				Period:  5 * time.Minute,
				Timeout: inngestgo.Ptr(10 * time.Minute),
			},
		},
		inngestgo.EventTrigger("intercom/company.updated", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// This function will only be scheduled 5 minutes after events are
			// no longer received with the same `data.account_id` field.
			//
			// `ctx.event` will be the last event in the series received.
			return nil, nil
		},
	)
	// !snippet:end
}
