package migration

// !snippet:start
import (
	"context"
	"net/http"

	"github.com/inngest/inngestgo"
)

func HighLevel() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
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
	if err != nil {
		panic(err)
	}

	_ = http.ListenAndServe(":8080", client.Serve())
}
