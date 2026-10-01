package best_practices

import "context"

type User struct{ Email string }

func sendWelcomeEmail(user User) error { return nil }

type Charge struct {
	ID string `json:"id"`
}

type ChargeParams struct {
	Amount         int
	IdempotencyKey string
}

type paymentsClient struct{}

func (paymentsClient) Charge(ctx context.Context, p ChargeParams) (Charge, error) {
	return Charge{}, nil
}

var payments paymentsClient
