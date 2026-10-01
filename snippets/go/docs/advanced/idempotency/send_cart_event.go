package idempotency

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendCartCheckoutCompleted(ctx context.Context, client inngestgo.Client) error {
	// !snippet:start
	cartID := "CGo5Q5ekAxilN92d27asEoDO"
	_, err := client.Send(ctx, inngestgo.Event{
		ID:   inngestgo.StrPtr("checkout-completed-" + cartID), // <-- This is the idempotency key
		Name: "cart/checkout.completed",
		Data: map[string]any{
			"email":  "taylor@example.com",
			"cartId": cartID,
		},
	})
	// !snippet:end
	return err
}
