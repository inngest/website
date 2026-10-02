package step_sleepuntil

// !snippet:start
import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ReminderScheduled struct {
	ReminderID string `json:"reminderId"`
	RemindAt   string `json:"remindAt"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "reminders"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "send-scheduled-reminder"},
		inngestgo.EventTrigger("app/reminder.scheduled", nil),
		func(ctx context.Context, input inngestgo.Input[ReminderScheduled]) (any, error) {
			remindAt, err := time.Parse(time.RFC3339, input.Event.Data.RemindAt)
			if err != nil {
				return nil, fmt.Errorf("invalid reminder time: %w", err)
			}

			step.SleepUntil(ctx, "wait-for-reminder", remindAt)

			return step.Run(ctx, "send-reminder", func(ctx context.Context) (any, error) {
				body, err := json.Marshal(map[string]string{
					"reminderId": input.Event.Data.ReminderID,
				})
				if err != nil {
					return nil, err
				}
				resp, err := http.Post(
					"https://api.example.com/reminders",
					"application/json",
					bytes.NewReader(body),
				)
				if err != nil {
					return nil, err
				}
				return nil, resp.Body.Close()
			})
		},
	)
	if err != nil {
		panic(err)
	}
}

// !snippet:end
