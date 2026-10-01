package singleton

// !snippet:start
import (
	"context"
	"log"
	"net/http"

	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type DataSyncStart struct {
	UserID string `json:"user_id"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "customer-sync"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "sync-user",
			Singleton: &inngestgo.ConfigSingleton{
				Key:  inngestgo.StrPtr("event.data.user_id"),
				Mode: enums.SingletonModeSkip,
			},
		},
		inngestgo.EventTrigger("data-sync.start", nil),
		func(ctx context.Context, input inngestgo.Input[DataSyncStart]) (any, error) {
			_, err := step.Run(ctx, "sync-user-data", func(ctx context.Context) (any, error) {
				log.Printf("syncing user %s", input.Event.Data.UserID)
				return nil, nil
			})
			return nil, err
		},
	)
	if err != nil {
		panic(err)
	}

	_ = http.ListenAndServe(":8080", client.Serve())
}

// !snippet:end
