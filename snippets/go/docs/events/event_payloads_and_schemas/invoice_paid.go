package event_payloads_and_schemas

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
)

// InvoicePaid is the typed data for the "billing/invoice.paid" event. Use the
// same struct as the type parameter of inngestgo.Input in functions that the
// event triggers.
type InvoicePaid struct {
	InvoiceID  string `json:"invoiceId"`
	CustomerID string `json:"customerId"`
}

type InvoicePaidEvent = inngestgo.GenericEvent[InvoicePaid]

func SendInvoicePaid(ctx context.Context) error {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "billing-app"})
	if err != nil {
		return err
	}

	_, err = client.Send(ctx, InvoicePaidEvent{
		Name: "billing/invoice.paid",
		Data: InvoicePaid{
			InvoiceID:  "inv_123",
			CustomerID: "cus_456",
		},
	})
	return err
}

// !snippet:end
