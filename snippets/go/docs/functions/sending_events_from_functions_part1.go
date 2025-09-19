package functions

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func loadCronInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "weekly-activity-load-users",
		},
		inngestgo.CronTrigger("0 12 * * 5"),
		func(ctx context.Context, input inngestgo.Input[any]) (any, error) {
			// Fetch all users
			users, err := step.Run(ctx, "fetch-users", func(ctx context.Context) ([]User, error) {
				return fetchUsers()
			})
			if err != nil {
				return nil, err
			}

			// For each user, send us an event. Inngest supports batches of events
			// as long as the entire payload is less than 512KB.
			events := make([]inngestgo.Event, len(users))
			for i, user := range users {
				events[i] = inngestgo.Event{
					Name: "app/weekly-email-activity.send",
					Data: map[string]interface{}{
						"user": user,
					},
				}
			}

			// Send all events to Inngest, which triggers any functions listening to
			// the given event names.
			_, err = step.SendMany(ctx, "send-events", events)
			if err != nil {
				return nil, err
			}

			// Return the number of users triggered
			return map[string]any{
				"count": len(users),
			}, nil
		},
	)
}

// !snippet:end

func fetchUsers() ([]User, error) {
	return nil, nil
}
