package timeouts

// !snippet:start

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func ScheduleReminderStartTimeout(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "schedule-reminder",
			Timeouts: &inngestgo.ConfigTimeouts{
				// If the run takes longer than 10s to start, cancel the run.
				Start: inngestgo.Ptr(10 * time.Second),
			},
		},
		inngestgo.EventTrigger("tasks/reminder.created", nil),
		func(ctx context.Context, input inngestgo.Input[ReminderCreatedEvent]) (any, error) {
			_, err := step.Run(ctx, "send-reminder-push", func(ctx context.Context) (any, error) {
				return nil, pushNotificationService.Push(ctx, input.Event.Data.Reminder)
			})
			return nil, err
		},
	)
}

// !snippet:end
