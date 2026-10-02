package durable_endpoints

import "context"

type Order struct {
	ID string `json:"id"`
}

type Reservation struct {
	ID string `json:"id"`
}

type Credits struct {
	Balance int `json:"balance"`
}

func loadOrder(ctx context.Context, orderID string) (Order, error) { panic("unimplemented") }

func reserveInventory(ctx context.Context, order Order) (Reservation, error) {
	panic("unimplemented")
}

func loadCredits(ctx context.Context, accountID string) (Credits, error) { panic("unimplemented") }
