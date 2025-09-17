package events

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendEventUserCreatedWithIdempotency() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my_app",
	})
	// !snippet:start
	_, err := client.Send(context.Background(), inngestgo.Event{
		Name: "storefront/cart.checkout.completed",
		ID:   inngestgo.StrPtr("cart-checkout-completed-ed12c8bde"),
		Data: map[string]any{
			"cartId":  "ed12c8bde",
			"itemIds": []string{"9f08sdh84", "sdf098487", "0fnun498n"},
			"account": map[string]any{
				"id":    123,
				"email": "test@example.com",
			},
		},
	})
	// !snippet:end
	_ = err
}
