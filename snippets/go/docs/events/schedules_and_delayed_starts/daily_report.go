package schedules_and_delayed_starts

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

// Assumes `buildReport` is defined elsewhere.
func DailyReport(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "daily-report"},
		inngestgo.CronTrigger("0 9 * * *"),
		func(ctx context.Context, input inngestgo.Input[any]) (any, error) {
			return step.Run(ctx, "build-report", buildReport)
		},
	)
}

// !snippet:end
