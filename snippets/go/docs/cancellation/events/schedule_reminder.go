package events

// !snippet:start

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ReminderCreatedData struct {
	ReminderID string    `json:"reminderId"`
	RemindAt   time.Time `json:"remindAt"`
}

func ScheduleReminder(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "schedule-reminder",
			Cancel: []inngestgo.ConfigCancel{
				{
					// The event name that cancels this function
					Event: "tasks/reminder.deleted",
					// Ensure the cancellation event (async) and the
					// triggering event (event)'s reminderId are the same:
					If: inngestgo.StrPtr("async.data.reminderId == event.data.reminderId"),
					// only in the first 24h since the function was scheduled.
					// this is optional.
					Timeout: inngestgo.StrPtr("24h"),
				},
			},
		},
		inngestgo.EventTrigger("reminders/created", nil),
		func(ctx context.Context, input inngestgo.Input[ReminderCreatedData]) (any, error) {
			step.SleepUntil(ctx, "wait-until-due", input.Event.Data.RemindAt)

			_, err := step.Run(ctx, "send-reminder", func(ctx context.Context) (any, error) {
				return nil, sendReminder(ctx, input.Event.Data)
			})
			return nil, err
		},
	)
}

// !snippet:end
