package durable_workflows

import "context"

type Invoice struct {
	ID string `json:"id"`
}

type Report struct {
	ID string `json:"id"`
}

func loadInvoice(ctx context.Context, id string) (Invoice, error) { panic("unimplemented") }

func chargeInvoice(ctx context.Context, invoice Invoice) error { panic("unimplemented") }

func buildReport(ctx context.Context) (Report, error) { panic("unimplemented") }

func syncAccount(ctx context.Context, accountID string) error { panic("unimplemented") }
