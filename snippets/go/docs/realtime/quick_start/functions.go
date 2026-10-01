package quick_start

// !snippet:start
import (
	"context"
	"encoding/json"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/realtime"
	"github.com/inngest/inngestgo/step"
)

type ProgressRequested struct {
	UserID string `json:"userId"`
}

type ProgressMessage struct {
	Message string `json:"message"`
}

func RegisterShowProgress(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "show-progress"},
		inngestgo.EventTrigger("demo/progress.requested", nil),
		func(ctx context.Context, input inngestgo.Input[ProgressRequested]) (any, error) {
			channel := "progress:" + input.Event.Data.UserID

			// Outside a step, Publish sends only the first time the function
			// reaches this line, so replays and retries don't repeat it.
			started, _ := json.Marshal(ProgressMessage{Message: "Started"})
			if err := realtime.Publish(ctx, channel, "status", started); err != nil {
				return nil, err
			}

			step.Sleep(ctx, "demo-wait", 3*time.Second)

			finished, _ := json.Marshal(ProgressMessage{Message: "The work is complete."})
			return nil, realtime.Publish(ctx, channel, "result", finished)
		},
	)
}

// !snippet:end
