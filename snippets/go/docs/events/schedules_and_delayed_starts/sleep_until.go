package schedules_and_delayed_starts

// !snippet:start
import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type UserCreated struct {
	// Assuming event.data.run_at is an RFC 3339 timestamp.
	RunAt time.Time `json:"run_at"`
}

func SendSignupEmail(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "send-signup-email"},
		inngestgo.EventTrigger("app/user.created", nil),
		func(ctx context.Context, input inngestgo.Input[UserCreated]) (any, error) {
			step.SleepUntil(
				ctx,
				"wait-for-iso-string",
				time.Date(2023, time.April, 1, 12, 30, 0, 0, time.UTC),
			)

			// You can also sleep until a timestamp within the event data. This lets you
			// pass in a time for you to run the job:
			step.SleepUntil(ctx, "wait-for-timestamp", input.Event.Data.RunAt)

			_, err := step.Run(ctx, "do-some-work-in-the-future", func(ctx context.Context) (any, error) {
				// This runs at the specified time.
				return nil, nil
			})
			return nil, err
		},
	)
}

// !snippet:end
