package idempotency

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendCheckoutCompleted(ctx context.Context, client inngestgo.Client, checkoutID string) error {
	// !snippet:start
	_, err := client.Send(ctx, inngestgo.Event{
		ID:   inngestgo.StrPtr("checkout-completed-" + checkoutID),
		Name: "cart/checkout.completed",
		Data: map[string]any{"checkoutId": checkoutID},
	})
	// !snippet:end
	return err
}
