package retries

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type InvoiceCreatedData struct {
	InvoiceID string `json:"invoiceId"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "billing-app"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:      "record-invoice",
			Retries: inngestgo.IntPtr(4),
		},
		inngestgo.EventTrigger("billing/invoice.created", nil),
		func(ctx context.Context, input inngestgo.Input[InvoiceCreatedData]) (any, error) {
			invoiceID := input.Event.Data.InvoiceID

			invoice, err := step.Run(ctx, "load-invoice", func(ctx context.Context) (Invoice, error) {
				return loadInvoice(ctx, invoiceID)
			})
			if err != nil {
				return nil, err
			}

			_, err = step.Run(ctx, "record-invoice", func(ctx context.Context) (any, error) {
				return nil, recordInvoiceInLedger(ctx, invoice, invoiceID)
			})
			return nil, err
		},
	)
	if err != nil {
		panic(err)
	}
}

// !snippet:end

var _ = main
