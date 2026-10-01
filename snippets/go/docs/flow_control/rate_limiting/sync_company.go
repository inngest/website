package rate_limiting

// !snippet:start
import (
	"context"
	"net/http"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type CompanyUpdated struct {
	CompanyID string `json:"company_id"`
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
			RateLimit: &inngestgo.ConfigRateLimit{
				Limit:  1,
				Period: 4 * time.Hour,
				Key:    inngestgo.StrPtr("event.data.company_id"),
			},
		},
		inngestgo.EventTrigger("company/updated", nil),
		func(ctx context.Context, input inngestgo.Input[CompanyUpdated]) (any, error) {
			_, err := step.Run(ctx, "sync-company-record", func(ctx context.Context) (any, error) {
				return nil, syncCompanyRecord(ctx, input.Event.Data.CompanyID)
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
