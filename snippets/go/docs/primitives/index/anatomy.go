package index

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type OrderEventData struct {
	OrderID string `json:"orderId"`
}

func anatomy(ctx context.Context, input inngestgo.Input[OrderEventData]) (any, error) {
	// !snippet:start
	order, err := step.Run(ctx, "load-order", func(ctx context.Context) (Order, error) {
		return getOrder(ctx, input.Event.Data.OrderID)
	})
	if err != nil {
		return nil, err
	}

	_, err = step.Run(ctx, "send-receipt", func(ctx context.Context) (any, error) {
		return nil, sendReceipt(ctx, order)
	})
	// !snippet:end
	return nil, err
}
