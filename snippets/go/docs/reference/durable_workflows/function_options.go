package durable_workflows

// !snippet:start
import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type InvoiceCreated struct {
	InvoiceID string `json:"invoiceId"`
	AccountID string `json:"accountId"`
}

func ChargeInvoice(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:   "charge-invoice",
			Name: "Charge invoice",
			// Retry each failed step up to 10 times.
			Retries: inngestgo.IntPtr(10),
			// Run one invoice at a time for each account.
			Concurrency: &inngestgo.ConfigConcurrency{
				Fn: []inngestgo.ConfigFnConcurrency{
					{Limit: 1, Key: inngestgo.StrPtr("event.data.accountId")},
				},
			},
			// Start at most 100 runs a minute.
			Throttle: &inngestgo.ConfigThrottle{Limit: 100, Period: time.Minute},
			// Cancel the run when the invoice is voided.
			Cancel: []inngestgo.ConfigCancel{
				{Event: "invoice/voided", If: inngestgo.StrPtr("event.data.invoiceId == async.data.invoiceId")},
			},
			// Cancel the run if it doesn't finish within an hour.
			Timeouts: &inngestgo.ConfigTimeouts{Finish: inngestgo.Ptr(time.Hour)},
		},
		inngestgo.EventTrigger("invoice/created", nil),
		func(ctx context.Context, input inngestgo.Input[InvoiceCreated]) (any, error) {
			invoice, err := step.Run(ctx, "load-invoice", func(ctx context.Context) (Invoice, error) {
				return loadInvoice(ctx, input.Event.Data.InvoiceID)
			})
			if err != nil {
				return nil, err
			}
			_, err = step.Run(ctx, "charge", func(ctx context.Context) (any, error) {
				return nil, chargeInvoice(ctx, invoice)
			})
			return nil, err
		},
	)
}

// !snippet:end
