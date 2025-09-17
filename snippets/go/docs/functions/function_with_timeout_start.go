package functions

// !snippet:start

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func loadInngestFnWithStartTimeout(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "A function",
			Timeouts: &inngestgo.ConfigTimeouts{
				// If the run takes longer than 10s to start, cancel the run.
				Start: inngestgo.Ptr(10 * time.Second),
			},
		},
		inngestgo.EventTrigger("tasks/reminder.created", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			return step.Run(ctx, "send-reminder", func(ctx context.Context) (bool, error) {
				// ...
				return false, nil
			})
		},
	)
}

// !snippet:end
