package non_retriable_errors

import (
	"context"
	"errors"

	"github.com/inngest/inngestgo"
)

func validateOrder(ctx context.Context, input inngestgo.Input[OrderRequestedData]) (any, error) {
	// !snippet:start
	if input.Event.Data.OrderID == "" {
		return nil, inngestgo.NoRetryError(errors.New("orderId is required"))
	}
	// !snippet:end
	return nil, nil
}

var _ = validateOrder
