package durable_workflows

import "context"

type Order struct {
	ID string `json:"id"`
}

func loadOrder(ctx context.Context, id string) (Order, error) { return Order{ID: id}, nil }
func chargeOrder(ctx context.Context, o Order) error          { return nil }
func sendReceipt(ctx context.Context, o Order) error          { return nil }
func refundOrder(ctx context.Context, o Order) error          { return nil }

type Row map[string]string

type ImportResult struct {
	Imported int `json:"imported"`
}

func parseCsv(ctx context.Context, uri string) ([]Row, error) { return nil, nil }
func getNormalizedColumnNames() map[string]string             { return nil }
func normalizeRows(rows []Row, m map[string]string) []Row     { return rows }
func importContacts(ctx context.Context, rows []Row) (ImportResult, error) {
	return ImportResult{}, nil
}
