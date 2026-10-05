package group_parallel

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/group"
	"github.com/inngest/inngestgo/step"
)

type Profile struct {
	ID string `json:"id"`
}

type Order struct {
	ID string `json:"id"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "parallel-example"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "get-values"},
		inngestgo.EventTrigger("app/values.requested", nil),
		func(ctx context.Context, input inngestgo.Input[any]) (any, error) {
			results := group.Parallel(
				ctx,
				func(ctx context.Context) (any, error) {
					return step.Run(ctx, "load-profile", func(ctx context.Context) (Profile, error) {
						return Profile{ID: "user-123"}, nil
					})
				},
				func(ctx context.Context) (any, error) {
					return step.Run(ctx, "load-orders", func(ctx context.Context) ([]Order, error) {
						return []Order{{ID: "order-456"}}, nil
					})
				},
			)
			if err := results.AnyError(); err != nil {
				return nil, err
			}

			return map[string]any{
				"profile": results[0].Value,
				"orders":  results[1].Value,
			}, nil
		},
	)
	if err != nil {
		panic(err)
	}
}

// !snippet:end
