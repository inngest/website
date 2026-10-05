package durable_workflows

// !snippet:start
import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type AccountUpdated struct {
	AccountID string `json:"accountId"`
	Plan      string `json:"plan"`
}

func SyncAccount(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "sync-account"},
		inngestgo.MultipleTriggers{
			// Run for each account update on a paid plan.
			inngestgo.EventTrigger("account/updated", inngestgo.StrPtr("event.data.plan != 'free'")),
			// Also run every night, spread across up to 10 minutes.
			inngestgo.CronTriggerWithJitter("TZ=America/New_York 0 2 * * *", 10*time.Minute),
		},
		func(ctx context.Context, input inngestgo.Input[AccountUpdated]) (any, error) {
			// A cron run has no event data, so AccountID is empty.
			_, err := step.Run(ctx, "sync-account", func(ctx context.Context) (any, error) {
				return nil, syncAccount(ctx, input.Event.Data.AccountID)
			})
			return nil, err
		},
	)
}

// !snippet:end
