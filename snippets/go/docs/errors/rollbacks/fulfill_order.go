package rollbacks

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type OrderPlacedData struct {
	OrderID string `json:"orderId"`
}

func FulfillOrder(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "fulfill-order"},
		inngestgo.EventTrigger("shop/order.placed", nil),
		func(ctx context.Context, input inngestgo.Input[OrderPlacedData]) (any, error) {
			orderID := input.Event.Data.OrderID

			reservationID, err := step.Run(ctx, "reserve-inventory", func(ctx context.Context) (string, error) {
				return reserveInventory(ctx, orderID)
			})
			if err != nil {
				return nil, err
			}

			_, err = step.Run(ctx, "charge-order", func(ctx context.Context) (any, error) {
				return nil, chargeOrder(ctx, orderID)
			})
			if err != nil {
				// charge-order exhausted its retries: compensate in its own step.
				_, releaseErr := step.Run(ctx, "release-inventory", func(ctx context.Context) (any, error) {
					return nil, releaseInventory(ctx, reservationID)
				})
				if releaseErr != nil {
					return nil, releaseErr
				}
				return nil, err
			}

			return nil, nil
		},
	)
}

// !snippet:end
