package send_events

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
)

func SendInvoicePaid(ctx context.Context) (string, error) {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "billing-app"})
	if err != nil {
		return "", err
	}

	id, err := client.Send(ctx, inngestgo.Event{
		Name: "billing/invoice.paid",
		Data: map[string]any{"invoiceId": "inv_123", "customerId": "cus_456"},
	})
	return id, err
}

// !snippet:end
