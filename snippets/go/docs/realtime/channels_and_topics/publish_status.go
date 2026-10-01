package channels_and_topics

// !snippet:start
import (
	"context"
	"encoding/json"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/realtime"
	"github.com/inngest/inngestgo/step"
)

type DocumentUploaded struct {
	DocumentID string `json:"documentId"`
}

func Register(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-document"},
		inngestgo.EventTrigger("app/document.uploaded", nil),
		func(ctx context.Context, input inngestgo.Input[DocumentUploaded]) (any, error) {
			// Channels and topics are plain strings in Go.
			channel := "document:" + input.Event.Data.DocumentID

			return step.Run(ctx, "analyze", func(ctx context.Context) (any, error) {
				data, err := json.Marshal(map[string]any{
					"message":  "Analyzing",
					"progress": 50,
				})
				if err != nil {
					return nil, err
				}
				// realtime.Publish works only inside an Inngest function.
				return nil, realtime.Publish(ctx, channel, "status", data)
			})
		},
	)
}

// !snippet:end
