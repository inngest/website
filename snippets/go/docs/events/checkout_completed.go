package events

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendEventCheckoutCompleted() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "acme-storefront-app",
	})
	if err != nil {
		panic(err)
	}
	// !snippet:start
	client.Send(context.Background(), inngestgo.Event{
		Name: "storefront/cart.checkout.completed",
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

}
