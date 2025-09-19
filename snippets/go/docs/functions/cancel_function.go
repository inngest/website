package functions

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
)

func loadScheduleReminderInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:   "schedule-reminder",
			Name: "Schedule reminder",
			Cancel: []inngestgo.ConfigCancel{
				{
					Event: "tasks/deleted",
					If:    inngestgo.StrPtr("event.data.id == async.data.id"),
				},
			},
		},
		// Run on every tasks/reminder.created event.
		inngestgo.EventTrigger("tasks/reminder.created", nil),
		ScheduleReminder,
	)
}

func ScheduleReminder(ctx context.Context, input inngestgo.Input[ScheduleReminderEvent]) (any, error) {
	// ...
	// ...
	return true, nil
}

// !snippet:end

type ScheduleReminderEvent struct {
}
