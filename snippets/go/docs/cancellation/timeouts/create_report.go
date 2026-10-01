package timeouts

// !snippet:start

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ReportCreatedData struct {
	ReportID string `json:"reportId"`
}

func CreateReport(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "create-report",
			Timeouts: &inngestgo.ConfigTimeouts{
				Start:  inngestgo.Ptr(10 * time.Minute),
				Finish: inngestgo.Ptr(time.Hour),
			},
		},
		inngestgo.EventTrigger("reports/created", nil),
		func(ctx context.Context, input inngestgo.Input[ReportCreatedData]) (any, error) {
			_, err := step.Run(ctx, "build-report", func(ctx context.Context) (any, error) {
				return nil, buildReport(ctx, input.Event.Data.ReportID)
			})
			return nil, err
		},
	)
}

// !snippet:end
