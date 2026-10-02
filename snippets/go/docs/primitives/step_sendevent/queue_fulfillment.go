package step_sendevent

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type OrderAccepted struct {
	OrderID string `json:"orderId"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "orders"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "queue-fulfillment"},
		inngestgo.EventTrigger("shop/order.accepted", nil),
		func(ctx context.Context, input inngestgo.Input[OrderAccepted]) (any, error) {
			id, err := step.Send(ctx, "publish-fulfillment-request", inngestgo.Event{
				ID:   inngestgo.StrPtr("fulfillment-request-" + input.Event.Data.OrderID),
				Name: "shop/fulfillment.requested",
				Data: map[string]any{"orderId": input.Event.Data.OrderID},
			})
			if err != nil {
				return nil, err
			}

			return map[string]string{"eventId": id}, nil
		},
	)
	if err != nil {
		panic(err)
	}
}

// !snippet:end
