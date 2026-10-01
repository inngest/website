package best_practices

import (
	"context"

	"github.com/inngest/inngestgo/step"
)

func sideEffectsExample(ctx context.Context, user User) error {
	// !snippet:start
	// Don't: runs again every time the function resumes
	if err := sendWelcomeEmail(user); err != nil {
		return err
	}

	// Do: runs once, and the result is saved
	_, err := step.Run(ctx, "send-welcome-email", func(ctx context.Context) (any, error) {
		return nil, sendWelcomeEmail(user)
	})
	// !snippet:end
	return err
}
