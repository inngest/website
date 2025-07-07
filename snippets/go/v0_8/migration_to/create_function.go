package migration

import (
	"context"

	"github.com/inngest/inngestgo"
)

func CreateFunction() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "my-fn"},
		inngestgo.EventTrigger("my-event", nil),
		func(
			ctx context.Context,
			input inngestgo.Input[inngestgo.GenericEvent[any, any]],
		) (any, error) {
			return "Hello, world!", nil
		},
	)
	// !snippet:end

	_ = err
}
