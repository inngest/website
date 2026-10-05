package priority

// !snippet:start
import (
	"context"
	"net/http"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type SummaryRequested struct {
	RequestID string `json:"requestId"`
	Tier      string `json:"tier"`
}

type RecordedRequest struct {
	RequestID string `json:"requestId"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "summaries"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "generate-summary",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{{Limit: 1}},
			},
			Priority: &inngestgo.ConfigPriority{
				Run: inngestgo.StrPtr("event.data.tier == 'enterprise' ? 120 : 0"),
			},
		},
		inngestgo.EventTrigger("ai/summary.requested", nil),
		func(ctx context.Context, input inngestgo.Input[SummaryRequested]) (any, error) {
			return step.Run(ctx, "record-request", func(ctx context.Context) (RecordedRequest, error) {
				return RecordedRequest{RequestID: input.Event.Data.RequestID}, nil
			})
		},
	)
	if err != nil {
		panic(err)
	}

	_ = http.ListenAndServe(":8080", client.Serve())
}

// !snippet:end
