package step_invoke

// !snippet:start
import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type CheckoutRequested struct {
	OrderID       string `json:"orderId"`
	SubtotalCents int    `json:"subtotalCents"`
	ShippingCents int    `json:"shippingCents"`
}

type TotalInput struct {
	SubtotalCents int `json:"subtotalCents"`
	ShippingCents int `json:"shippingCents"`
}

type TotalResult struct {
	TotalCents int `json:"totalCents"`
}

func Functions(client inngestgo.Client) ([]inngestgo.ServableFunction, error) {
	calculateTotal, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "calculate-total"},
		// Go functions need a trigger. This event is never sent; the function
		// only runs when it is invoked.
		inngestgo.EventTrigger("checkout/calculate-total", nil),
		func(ctx context.Context, input inngestgo.Input[TotalInput]) (any, error) {
			return TotalResult{
				TotalCents: input.Event.Data.SubtotalCents + input.Event.Data.ShippingCents,
			}, nil
		},
	)
	if err != nil {
		return nil, err
	}

	prepareCheckout, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "prepare-checkout"},
		inngestgo.EventTrigger("checkout/requested", nil),
		func(ctx context.Context, input inngestgo.Input[CheckoutRequested]) (any, error) {
			total, err := step.Invoke[TotalResult](ctx, "calculate-total", step.InvokeOpts{
				FunctionId: calculateTotal.FullyQualifiedID(),
				Data: map[string]any{
					"subtotalCents": input.Event.Data.SubtotalCents,
					"shippingCents": input.Event.Data.ShippingCents,
				},
				Timeout: 5 * time.Minute,
			})
			if err != nil {
				return nil, err
			}

			return map[string]any{
				"orderId":    input.Event.Data.OrderID,
				"totalCents": total.TotalCents,
			}, nil
		},
	)
	if err != nil {
		return nil, err
	}

	return []inngestgo.ServableFunction{calculateTotal, prepareCheckout}, nil
}

// !snippet:end
