package platform_overview

// !snippet:start
import (
	"context"
	"encoding/json"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/realtime"
	"github.com/inngest/inngestgo/step"
)

type TicketCreated struct {
	TicketID string `json:"ticketId"`
}

func AnswerTicket(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "answer-ticket"},
		inngestgo.EventTrigger("support/ticket.created", nil),
		func(ctx context.Context, input inngestgo.Input[TicketCreated]) (any, error) {
			ticketID := input.Event.Data.TicketID

			// Each step's result is saved. A retry skips steps that already finished.
			tc, err := step.Run(ctx, "load-context", func(ctx context.Context) (TicketContext, error) {
				return loadTicketContext(ctx, ticketID)
			})
			if err != nil {
				return nil, err
			}

			answer, err := step.Run(ctx, "draft-answer", func(ctx context.Context) (string, error) {
				return draftAnswer(ctx, tc)
			})
			if err != nil {
				return nil, err
			}

			// Stream progress to the customer's browser.
			_, err = step.Run(ctx, "drafted", func(ctx context.Context) (any, error) {
				data, err := json.Marshal(map[string]string{"message": "Sending your answer…"})
				if err != nil {
					return nil, err
				}
				return nil, realtime.Publish(ctx, "ticket:"+ticketID, "status", data)
			})
			if err != nil {
				return nil, err
			}

			_, err = step.Run(ctx, "send-reply", func(ctx context.Context) (any, error) {
				return nil, sendReply(ctx, ticketID, answer)
			})
			return nil, err
		},
	)
}

// !snippet:end
