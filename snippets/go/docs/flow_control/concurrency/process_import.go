package concurrency

// !snippet:start
import (
	"context"
	"net/http"
	"strings"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ImportRequested struct {
	ImportID string `json:"importId"`
}

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "imports"})
	if err != nil {
		panic(err)
	}

	_, err = inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "process-import",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{{Limit: 10}},
			},
		},
		inngestgo.EventTrigger("imports/requested", nil),
		func(ctx context.Context, input inngestgo.Input[ImportRequested]) (any, error) {
			return step.Run(ctx, "normalize-import-id", func(ctx context.Context) (string, error) {
				return strings.ToUpper(input.Event.Data.ImportID), nil
			})
		},
	)
	if err != nil {
		panic(err)
	}

	_ = http.ListenAndServe(":8080", client.Serve())
}

// !snippet:end
