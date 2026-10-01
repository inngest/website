package durable_workflows

// !snippet:start
import (
	"context"
	"errors"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type OrderPlaced struct {
	OrderID string `json:"orderId"`
}

type OrderCancelled struct {
	OrderID string `json:"orderId"`
}

func ProcessOrder(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-order"},
		// any time the `shop/order.placed` event is received, this will run.
		inngestgo.EventTrigger("shop/order.placed", nil),
		func(ctx context.Context, input inngestgo.Input[OrderPlaced]) (any, error) {
			order, err := step.Run(ctx, "load-order", func(ctx context.Context) (Order, error) {
				return loadOrder(ctx, input.Event.Data.OrderID)
			})
			if err != nil {
				return nil, err
			}
			if _, err := step.Run(ctx, "charge-order", func(ctx context.Context) (any, error) {
				return nil, chargeOrder(ctx, order)
			}); err != nil {
				return nil, err
			}
			if _, err := step.Run(ctx, "send-receipt", func(ctx context.Context) (any, error) {
				return nil, sendReceipt(ctx, order)
			}); err != nil {
				return nil, err
			}

			// this will wait for the `shop/order.cancelled` event for up to 6 hours,
			// and resume immediately when a matching event is received.  If an event
			// isn't received within 6 hours, the function resumes and WaitForEvent
			// returns step.ErrEventNotReceived.
			//
			// your compute is *not running* during this wait, and you do not need to handle
			// any matching.
			_, err = step.WaitForEvent[inngestgo.GenericEvent[OrderCancelled]](
				ctx,
				"wait-for-cancellation",
				step.WaitForEventOpts{
					Event:   "shop/order.cancelled",
					If:      inngestgo.StrPtr("event.data.orderId == async.data.orderId"),
					Timeout: 6 * time.Hour,
				},
			)
			if errors.Is(err, step.ErrEventNotReceived) {
				return map[string]any{"orderId": order.ID}, nil
			}
			if err != nil {
				return nil, err
			}

			// the order was cancelled, as we received a cancel event
			if _, err := step.Run(ctx, "refund-order", func(ctx context.Context) (any, error) {
				return nil, refundOrder(ctx, order)
			}); err != nil {
				return nil, err
			}
			return map[string]any{"orderId": order.ID, "status": "cancelled"}, nil
		},
	)
}

// !snippet:end
