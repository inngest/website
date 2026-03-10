package examples

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func WorkingWithLoops() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "shopify-product-import",
		},
		inngestgo.EventTrigger("shopify/import.requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			var allProducts []shopify.Product
			var cursor *string
			hasMore := true

			// Use the event's "data" to pass key info like IDs
			// Note: in this example is deterministic across multiple requests
			// If the returned results must stay in the same order, wrap the db call in step.run()
			session, err := database.GetShopifySession(input.Event.Data["storeId"].(string))
			if err != nil {
				return err
			}

			for hasMore {
				if page, err := step.Run(ctx, fmt.Sprintf("fetch-products-%v", cursor), func(ctx context.Context) ([]shopify.Product, error) {
					return shopify.Product.All(&shopify.ProductListOptions{
						Session: session,
						SinceID: cursor,
					})
				}); err != nil {
					return err, nil
				}

				// Combine all of the data into a single list
				allProducts = append(allProducts, page.Products...)

				if len(page.Products) == 50 {
					id := page.Products[49].ID
					cursor = &id
				} else {
					hasMore = false
				}
			}

			// Now we have the entire list of products within allProducts!
			return nil, nil
		},
	)
	// !snippet:end

	_ = err
}
