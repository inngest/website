package receive_webhook_events

// !snippet:start
import (
	"context"
	"encoding/json"
	"errors"

	"github.com/inngest/inngestgo"
)

type StripeWebhook struct {
	Raw string `json:"raw"`
	Sig string `json:"sig"`
}

func StripeChargeUpdated(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "stripe/charge.updated"},
		inngestgo.EventTrigger("stripe/charge.updated", nil),
		func(ctx context.Context, input inngestgo.Input[StripeWebhook]) (any, error) {
			// Replace verifySig with the provider's verification method.
			if !verifySig(input.Event.Data.Raw, input.Event.Data.Sig, stripeSecret) {
				return nil, inngestgo.NoRetryError(errors.New("failed signature verification"))
			}

			// Now it's safe to use the event data.
			var data map[string]any
			if err := json.Unmarshal([]byte(input.Event.Data.Raw), &data); err != nil {
				return nil, inngestgo.NoRetryError(err)
			}
			return nil, nil
		},
	)
}

// !snippet:end
