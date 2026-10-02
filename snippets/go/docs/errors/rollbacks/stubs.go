package rollbacks

import "context"

func reserveInventory(ctx context.Context, orderID string) (string, error) { return "res_1", nil }
func chargeOrder(ctx context.Context, orderID string) error                { return nil }
func releaseInventory(ctx context.Context, reservationID string) error     { return nil }
