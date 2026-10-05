package multi_tenancy

// !snippet:start
import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type TenantSyncRequested struct {
	TenantID string `json:"tenant_id"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "tenant-sync"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "sync-tenant-data",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{
					{
						Key:   inngestgo.StrPtr("event.data.tenant_id"),
						Limit: 5,
					},
				},
			},
			Throttle: &inngestgo.ConfigThrottle{
				Key:    inngestgo.StrPtr("event.data.tenant_id"),
				Limit:  100,
				Period: time.Minute,
			},
		},
		inngestgo.EventTrigger("app/tenant.sync.requested", nil),
		func(ctx context.Context, input inngestgo.Input[TenantSyncRequested]) (any, error) {
			_, err := step.Run(ctx, "sync-data", func(ctx context.Context) (any, error) {
				log.Println(input.Event.Data.TenantID)
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
