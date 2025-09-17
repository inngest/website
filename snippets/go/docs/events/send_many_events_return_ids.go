package events

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendManyEventsShowReturnedIds() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "acme-storefront-app",
	})
	if err != nil {
		panic(err)
	}
	ctx := context.Background()
	data := map[string]any{
		"cartId":  "ed12c8bde",
		"itemIds": []string{"9f08sdh84", "sdf098487", "0fnun498n"},
		"account": map[string]any{
			"id":    123,
			"email": "test@example.com",
		},
	}
	// !snippet:start
	var events []any
	events = append(events, inngestgo.Event{
		Name: "storefront/cart.checkout.completed",
		Data: data,
	})

	events = append(events, inngestgo.Event{
		Name: "storefront/coupon.used",
		Data: data,
	})

	events = append(events, inngestgo.Event{
		Name: "storefront/loyalty.program.joined",
		Data: data,
	})

	_, err = client.SendMany(ctx, events)

	//   ids = [
	//     "01HQ8PTAESBZPBDS8JTRZZYY3S",
	//     "01HQ8PTFYYKDH1CP3C6PSTBZN5",
	//     "01HQ8PTAYNKDH1CP3R6PSTUKL4",
	//   ]

	// !snippet:end

}
