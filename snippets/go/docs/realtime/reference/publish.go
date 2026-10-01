package reference

// !snippet:start
import (
	"context"
	"encoding/json"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/realtime"
	"github.com/inngest/inngestgo/step"
)

type JobStarted struct {
	JobID string `json:"jobId"`
}

func processJob(ctx context.Context, input inngestgo.Input[JobStarted]) (any, error) {
	channel := "job:" + input.Event.Data.JobID

	// Outside a step: sends once, and isn't repeated on replay or retry.
	complete, _ := json.Marshal(map[string]string{"message": "Complete"})
	if err := realtime.Publish(ctx, channel, "status", complete); err != nil {
		return nil, err
	}

	// Inside a step: sends each time the step runs, including retries.
	return step.Run(ctx, "report-progress", func(ctx context.Context) (any, error) {
		processing, _ := json.Marshal(map[string]string{"message": "Processing"})
		return nil, realtime.Publish(ctx, channel, "status", processing)
	})
}

// !snippet:end

var _ = processJob
