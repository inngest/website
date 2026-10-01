package timeouts

import "context"

func buildReport(ctx context.Context, reportID string) error { return nil }

type pushService struct{}

func (pushService) Push(ctx context.Context, reminder map[string]any) error { return nil }

var pushNotificationService = pushService{}

type ReminderCreatedEvent struct {
	Reminder map[string]any `json:"reminder"`
}
