package receive_webhook_events

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ClerkUserCreated struct {
	EmailAddresses []struct {
		EmailAddress string `json:"email_address"`
	} `json:"email_addresses"`
}

// Assumes `emails` is your email provider's client, such as Resend.
func SendWelcomeEmail(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "send-welcome-email"},
		inngestgo.EventTrigger("clerk/user.created", nil),
		func(ctx context.Context, input inngestgo.Input[ClerkUserCreated]) (any, error) {
			emailAddress := input.Event.Data.EmailAddresses[0].EmailAddress
			return step.Run(ctx, "send-email", func(ctx context.Context) (any, error) {
				return emails.Send(ctx, Email{
					To:      emailAddress,
					From:    "noreply@inngest.com",
					Subject: "Welcome to Inngest!",
					HTML:    welcomeEmailHTML(),
				})
			})
		},
	)
}

// !snippet:end
