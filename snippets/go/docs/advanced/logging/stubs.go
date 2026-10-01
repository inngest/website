package logging

import "context"

type Charge struct {
	ID string `json:"id"`
}

func chargeOrder(ctx context.Context, orderID string) (Charge, error) { return Charge{}, nil }
