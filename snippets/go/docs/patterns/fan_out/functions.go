package fan_out

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type UserSignedUpData struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
}

func WelcomeEmail(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "send-welcome-email"},
		inngestgo.EventTrigger("app/user.signed_up", nil),
		func(ctx context.Context, input inngestgo.Input[UserSignedUpData]) (any, error) {
			_, err := step.Run(ctx, "send-email", func(ctx context.Context) (any, error) {
				return nil, sendWelcomeEmail(ctx, input.Event.Data.Email)
			})
			return nil, err
		},
	)
}

func TrialSetup(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "start-trial"},
		inngestgo.EventTrigger("app/user.signed_up", nil),
		func(ctx context.Context, input inngestgo.Input[UserSignedUpData]) (any, error) {
			_, err := step.Run(ctx, "create-trial", func(ctx context.Context) (any, error) {
				return nil, createTrial(ctx, input.Event.Data.UserID)
			})
			return nil, err
		},
	)
}

// !snippet:end
