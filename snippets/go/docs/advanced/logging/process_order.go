package logging

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/middleware"
	"github.com/inngest/inngestgo/step"
)

type OrderCreatedData struct {
	OrderID string `json:"orderId"`
}

func ProcessOrder(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-order"},
		inngestgo.EventTrigger("order/created", nil),
		func(ctx context.Context, input inngestgo.Input[OrderCreatedData]) (any, error) {
			return step.Run(ctx, "charge-order", func(ctx context.Context) (Charge, error) {
				// The client's *slog.Logger (ClientOpts.Logger), deduplicated across resumes.
				logger := middleware.LoggerFromContext(ctx)
				logger.Info("Charging order", "orderId", input.Event.Data.OrderID)
				return chargeOrder(ctx, input.Event.Data.OrderID)
			})
		},
	)
}

// !snippet:end
