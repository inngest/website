package event_and_trigger_concepts

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
)

type OrderPlaced struct {
	OrderID string  `json:"orderId"`
	Total   float64 `json:"total"`
}

func LargeOrder(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-large-order"},
		inngestgo.EventTrigger(
			"shop/order.placed",
			inngestgo.StrPtr("event.data.total > 100"),
		),
		func(ctx context.Context, input inngestgo.Input[OrderPlaced]) (any, error) {
			return processOrder(input.Event.Data)
		},
	)
}

// !snippet:end
