package functions

// !snippet:start

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func loadSendSignUpEmailInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "send-signup-email",
		},
		inngestgo.EventTrigger("app/user.created", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// business logic
			_, err := step.Run(ctx, "send-the-user-a-signup-email", func(ctx context.Context) (any, error) {
				return SendEmail(SendEmailInput{
					To:      input.Event.Data["user_email"].(string),
					Subject: "Welcome to Inngest!",
					Message: "...",
				})
			})
			if err != nil {
				return nil, err
			}

			step.Sleep(ctx, "wait-for-the-future", 4*time.Hour)

			_, err = step.Run(ctx, "do-some-work-in-the-future", func(ctx context.Context) (any, error) {
				// Code here runs in the future automatically.
				return nil, nil
			})
			return nil, err
		},
	)
}

// !snippet:end

type SendEmailInput struct {
	To      string
	Subject string
	Message string
}

func SendEmail(i SendEmailInput) (any, error) {
	panic("unimplemented")
}
