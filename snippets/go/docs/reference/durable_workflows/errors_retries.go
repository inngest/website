package durable_workflows

// !snippet:start
import (
	"context"
	"fmt"
	"time"

	"github.com/inngest/inngestgo"
	inngesterrors "github.com/inngest/inngestgo/errors"
	"github.com/inngest/inngestgo/step"
)

type ReportRequested struct {
	ReportID string `json:"reportId"`
}

var errRateLimited = fmt.Errorf("rate limited")

func BuildReport(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "build-report"},
		inngestgo.EventTrigger("report/requested", nil),
		func(ctx context.Context, input inngestgo.Input[ReportRequested]) (any, error) {
			if input.Event.Data.ReportID == "" {
				// The event can never succeed, so don't retry.
				return nil, inngesterrors.NoRetryError(fmt.Errorf("reportId is required"))
			}

			return step.Run(ctx, "build-report", func(ctx context.Context) (Report, error) {
				report, err := buildReport(ctx)
				if err == errRateLimited {
					// Retry this step in 5 minutes instead of on the default backoff.
					return Report{}, inngesterrors.RetryAtError(err, time.Now().Add(5*time.Minute))
				}
				// Any other error retries the step with backoff.
				return report, err
			})
		},
	)
}

// !snippet:end
