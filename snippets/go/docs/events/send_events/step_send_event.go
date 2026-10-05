package send_events

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type InvoiceData struct {
	InvoiceID string `json:"invoiceId"`
}

func notifyAccounting(ctx context.Context, input inngestgo.Input[InvoiceData]) (any, error) {
	event := input.Event
	// !snippet:start
	_, err := step.Send(ctx, "notify-accounting", inngestgo.Event{
		Name: "billing/invoice.paid",
		Data: map[string]any{"invoiceId": event.Data.InvoiceID},
	})
	// !snippet:end
	return nil, err
}
