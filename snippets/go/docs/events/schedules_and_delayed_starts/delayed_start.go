package schedules_and_delayed_starts

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
)

func sendReminder(ctx context.Context, client inngestgo.Client) error {
	// !snippet:start
	_, err := client.Send(ctx, inngestgo.Event{
		Name:      "notifications/reminder.due",
		Data:      map[string]any{"reminderId": "rem_123"},
		Timestamp: time.Now().Add(5 * time.Minute).UnixMilli(),
	})
	// !snippet:end
	return err
}
