package debounce

// !snippet:start
import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type CompanyUpdated struct {
	AccountID string `json:"account_id"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "customer-sync"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "sync-company",
			Debounce: &inngestgo.ConfigDebounce{
				Key:     "event.data.account_id",
				Period:  5 * time.Minute,
				Timeout: inngestgo.Ptr(10 * time.Minute),
			},
		},
		inngestgo.EventTrigger("company/updated", nil),
		func(ctx context.Context, input inngestgo.Input[CompanyUpdated]) (any, error) {
			_, err := step.Run(ctx, "process-latest-update", func(ctx context.Context) (any, error) {
				log.Println(input.Event.Data.AccountID)
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
