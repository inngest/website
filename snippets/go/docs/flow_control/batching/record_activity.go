package batching

// !snippet:start
import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ActivityData struct {
	AccountID string `json:"accountId"`
	Action    string `json:"action"`
}

type ActivityRow struct {
	AccountID string `json:"accountId"`
	Action    string `json:"action"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "activity"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "record-activity",
			BatchEvents: &inngestgo.ConfigBatchEvents{
				MaxSize: 5,
				Timeout: 5 * time.Second,
				Key:     inngestgo.StrPtr("event.data.accountId"),
			},
		},
		inngestgo.EventTrigger("activity/recorded", nil),
		func(ctx context.Context, input inngestgo.Input[ActivityData]) (any, error) {
			rows := make([]ActivityRow, 0, len(input.Events))
			for _, evt := range input.Events {
				rows = append(rows, ActivityRow{
					AccountID: evt.Data.AccountID,
					Action:    evt.Data.Action,
				})
			}

			return step.Run(ctx, "write-batch", func(ctx context.Context) (int, error) {
				log.Println(rows)
				return len(rows), nil
			})
		},
	)
	if err != nil {
		panic(err)
	}

	_ = http.ListenAndServe(":8080", client.Serve())
}

// !snippet:end
