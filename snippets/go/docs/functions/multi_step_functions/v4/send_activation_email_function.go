package multistepfunctions_v4

// !snippet:start

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func sendActivationEmailInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "activation-email",
		},
		inngestgo.EventTrigger("app/user.created", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// Send welcome email
			_, err := step.Run(ctx, "send-welcome-email", func(ctx context.Context) (any, error) {
				return nil, sendEmail(input.Event.Data["user"].(map[string]interface{})["email"].(string), "welcome")
			})
			if err != nil {
				return nil, err
			}

			// Wait for post creation event
			postCreated, err := step.WaitForEvent[map[string]any](
				ctx,
				"wait-for-post-creation",
				step.WaitForEventOpts{
					Event:   "app/post.created",
					If:      StringPtr(`async.data.user.id == event.data.user.id`), // the field "data.user.id" must match
					Timeout: 24 * time.Hour,                                        // wait at most 24 hours
				},
			)
			if err != nil {
				return nil, err
			}

			// If no post was created, send reminder email
			if postCreated == nil {
				_, err := step.Run(ctx, "send-reminder-email", func(ctx context.Context) (any, error) {
					return nil, sendEmail(input.Event.Data["user"].(map[string]interface{})["email"].(string), "reminder")
				})
				if err != nil {
					return nil, err
				}
			}

			return nil, nil
		},
	)
}

// !snippet:end

func sendEmail(email any, msg any) error {
	return nil
}

func StringPtr(x string) *string {
	return &x
}
