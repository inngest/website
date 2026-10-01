package versioning

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func addStep(ctx context.Context, input inngestgo.Input[SignupData]) (any, error) {
	// !snippet:start
	_, err := step.Run(ctx, "send-welcome-email", func(ctx context.Context) (any, error) {
		return nil, sendWelcomeEmail(ctx, input.Event.Data.Email)
	})
	if err != nil {
		return nil, err
	}
	_, err = step.Run(ctx, "track-signup", func(ctx context.Context) (any, error) {
		return nil, analytics.Track(ctx, "user_signup_complete", input.Event.Data)
	})
	if err != nil {
		return nil, err
	}
	_, err = step.Run(ctx, "sync-to-crm", func(ctx context.Context) (any, error) {
		return nil, crm.Contacts.Create(ctx, input.Event.Data)
	})
	// !snippet:end
	return nil, err
}

var _ = addStep
