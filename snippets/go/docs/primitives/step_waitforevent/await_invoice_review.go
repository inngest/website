package step_waitforevent

// !snippet:start
import (
	"context"
	"errors"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ApprovalRequested struct {
	InvoiceID string `json:"invoiceId"`
}

type ApprovalRecorded struct {
	InvoiceID string `json:"invoiceId"`
	Approved  bool   `json:"approved"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "billing"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "await-invoice-review"},
		inngestgo.EventTrigger("invoice/approval.requested", nil),
		func(ctx context.Context, input inngestgo.Input[ApprovalRequested]) (any, error) {
			review, err := step.WaitForEvent[inngestgo.GenericEvent[ApprovalRecorded]](
				ctx,
				"wait-for-review",
				step.WaitForEventOpts{
					Event:   "invoice/approval.recorded",
					If:      inngestgo.StrPtr("event.data.invoiceId == async.data.invoiceId"),
					Timeout: 7 * 24 * time.Hour,
				},
			)
			if errors.Is(err, step.ErrEventNotReceived) {
				return map[string]string{
					"invoiceId": input.Event.Data.InvoiceID,
					"status":    "timed-out",
				}, nil
			}
			if err != nil {
				return nil, err
			}

			status := "rejected"
			if review.Data.Approved {
				status = "approved"
			}
			return map[string]string{
				"invoiceId": input.Event.Data.InvoiceID,
				"status":    status,
			}, nil
		},
	)
	if err != nil {
		panic(err)
	}
}

// !snippet:end
