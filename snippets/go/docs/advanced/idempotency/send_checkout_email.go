package idempotency

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
)

func SendEmail(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "send-checkout-email",
			// This is the idempotency key
			Idempotency: inngestgo.StrPtr("event.data.cartId"),
			// Evaluates to: "s6CIMNqIaxt503I1gVEICfwp"
			// for the given event payload
		},
		inngestgo.EventTrigger("cart/checkout.completed", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// ...
			return nil, nil
		},
	)
}

// !snippet:end
