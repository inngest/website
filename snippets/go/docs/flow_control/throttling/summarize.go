package throttling

// !snippet:start
import (
	"context"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type SummaryRequested struct {
	UserID string `json:"user_id"`
	Text   string `json:"text"`
}

type RecordedRequest struct {
	UserID     string `json:"userId"`
	TextLength int    `json:"textLength"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "summarize",
			Throttle: &inngestgo.ConfigThrottle{
				Limit:  1,
				Period: 5 * time.Second,
				Burst:  2,
				Key:    inngestgo.StrPtr("event.data.user_id"),
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[SummaryRequested]) (any, error) {
			return step.Run(ctx, "record-request", func(ctx context.Context) (RecordedRequest, error) {
				return RecordedRequest{
					UserID:     input.Event.Data.UserID,
					TextLength: len(input.Event.Data.Text),
				}, nil
			})
		},
	)
	if err != nil {
		panic(err)
	}

	_ = http.ListenAndServe(":8080", client.Serve())
}

// !snippet:end
