package retries

import "context"

type Invoice struct {
	ID string `json:"id"`
}

func loadInvoice(ctx context.Context, id string) (Invoice, error) { return Invoice{ID: id}, nil }

func recordInvoiceInLedger(ctx context.Context, invoice Invoice, invoiceID string) error {
	return nil
}
