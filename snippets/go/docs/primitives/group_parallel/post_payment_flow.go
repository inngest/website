package group_parallel

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/group"
	"github.com/inngest/inngestgo/step"
)

// `sendEmail()` and `db` are your app's own helpers.

type ChargeCreated struct {
	Email string `json:"email"`
}

func PostPaymentFlow(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "post-payment-flow"},
		inngestgo.EventTrigger("stripe/charge.created", nil),
		func(ctx context.Context, input inngestgo.Input[ChargeCreated]) (any, error) {
			// Each callback holds one step. group.Parallel runs them in
			// parallel and returns their results in order.
			results := group.Parallel(
				ctx,
				func(ctx context.Context) (any, error) {
					return step.Run(ctx, "confirmation-email", func(ctx context.Context) (string, error) {
						return sendEmail(ctx, input.Event.Data.Email)
					})
				},
				func(ctx context.Context) (any, error) {
					return step.Run(ctx, "update-user", func(ctx context.Context) (UserUpdate, error) {
						return db.UpdateUserWithCharge(ctx, input.Event)
					})
				},
			)
			if err := results.AnyError(); err != nil {
				return nil, err
			}

			return map[string]any{
				"emailID": results[0].Value,
				"updates": results[1].Value,
			}, nil
		},
	)
}

// !snippet:end
