package send_events

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type UserSignup struct {
	UserID string `json:"userId"`
}

func UserOnboarding(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "user-onboarding"},
		inngestgo.EventTrigger("app/user.signup", nil),
		func(ctx context.Context, input inngestgo.Input[UserSignup]) (any, error) {
			// Do something
			_, err := step.Send(ctx, "send-activation-event", inngestgo.Event{
				Name: "app/user.activated",
				Data: map[string]any{"userId": input.Event.Data.UserID},
			})
			if err != nil {
				return nil, err
			}
			// Do something else
			return nil, nil
		},
	)
}

// !snippet:end
