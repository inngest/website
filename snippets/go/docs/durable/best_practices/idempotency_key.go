package best_practices

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo/step"
)

func idempotencyKeyExample(ctx context.Context, amount int, orderID string) error {
	// !snippet:start
	_, err := step.Run(ctx, "charge-customer", func(ctx context.Context) (Charge, error) {
		return payments.Charge(ctx, ChargeParams{
			Amount:         amount,
			IdempotencyKey: fmt.Sprintf("order-%s-charge", orderID),
		})
	})
	// !snippet:end
	return err
}
