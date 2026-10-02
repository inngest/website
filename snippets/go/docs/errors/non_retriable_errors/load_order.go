package non_retriable_errors

// !snippet:start

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type OrderRequestedData struct {
	OrderID string `json:"orderId"`
}

func LoadOrder(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "load-order"},
		inngestgo.EventTrigger("shop/order.requested", nil),
		func(ctx context.Context, input inngestgo.Input[OrderRequestedData]) (any, error) {
			return step.Run(ctx, "load-order", func(ctx context.Context) (map[string]any, error) {
				resp, err := http.Get(fmt.Sprintf("https://api.example.com/orders/%s", input.Event.Data.OrderID))
				if err != nil {
					return nil, err
				}
				defer resp.Body.Close()

				if resp.StatusCode == http.StatusNotFound {
					return nil, inngestgo.NoRetryError(errors.New("order does not exist"))
				}
				if resp.StatusCode >= 300 {
					return nil, fmt.Errorf("order API returned %d", resp.StatusCode)
				}

				var order map[string]any
				err = json.NewDecoder(resp.Body).Decode(&order)
				return order, err
			})
		},
	)
}

// !snippet:end
