package index

import "context"

type Order struct {
	ID string `json:"id"`
}

func getOrder(ctx context.Context, id string) (Order, error) { return Order{ID: id}, nil }
func sendReceipt(ctx context.Context, order Order) error     { return nil }
