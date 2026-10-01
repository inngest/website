package reference

// !snippet:start
import (
	"context"
	"encoding/json"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/realtime"
	"github.com/inngest/inngestgo/step"
)

type ImportRequested struct {
	UserID string `json:"userId"`
}

func processImport(ctx context.Context, input inngestgo.Input[ImportRequested]) (any, error) {
	channel := "user:" + input.Event.Data.UserID

	data, _ := json.Marshal(map[string]string{"message": "Started"})
	if err := realtime.Publish(ctx, channel, "status", data); err != nil {
		return nil, err
	}

	return step.Run(ctx, "import", func(ctx context.Context) (string, error) {
		// Do the work, then report the result.
		data, _ := json.Marshal(map[string]string{"message": "Complete"})
		return "done", realtime.Publish(ctx, channel, "result", data)
	})
}

// !snippet:end

var _ = processImport
