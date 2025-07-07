package migration

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
)

func InputSnippet() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my-app",
	})

	// !snippet:start
	type MyEventData struct {
		Message string `json:"message"`
	}

	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "my-fn"},
		inngestgo.EventTrigger("my-event", nil),
		func(
			ctx context.Context,
			input inngestgo.Input[MyEventData],
		) (any, error) {
			fmt.Println(input.Event.Data.Message)
			return nil, nil
		},
	)
	// !snippet:end

	_ = err
}
