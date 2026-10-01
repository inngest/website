package concurrency

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type FileUploaded struct {
	CustomerID string `json:"customerId"`
	FileURI    string `json:"fileURI"`
}

func ProcessCustomerImport(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID: "process-customer-import",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{
					{Limit: 1, Key: inngestgo.StrPtr("event.data.customerId")},
				},
			},
		},
		inngestgo.EventTrigger("csv/file.uploaded", nil),
		func(ctx context.Context, input inngestgo.Input[FileUploaded]) (any, error) {
			_, err := step.Run(ctx, "process-file", func(ctx context.Context) (any, error) {
				return nil, processFile(ctx, input.Event.Data.FileURI)
			})
			return nil, err
		},
	)
}

// !snippet:end
