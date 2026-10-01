package concurrency

// !snippet:start
import (
	"context"
	"log"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type CSVFileUploaded struct {
	CustomerID string `json:"customerId"`
	FileURI    string `json:"fileURI"`
}

func ProcessCustomerCSVImport(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "Process customer csv import",
			ID:   "process-customer-csv-import",
			Concurrency: &inngestgo.ConfigConcurrency{
				Step: []inngestgo.ConfigStepConcurrency{
					{
						Limit: 1,
						// You can use any piece of data from the event payload
						Key: inngestgo.StrPtr("event.data.customerId"),
					},
				},
			},
		},
		inngestgo.EventTrigger("csv/file.uploaded", nil),
		func(ctx context.Context, input inngestgo.Input[CSVFileUploaded]) (any, error) {
			_, err := step.Run(ctx, "process-file", func(ctx context.Context) (any, error) {
				file, err := bucket.Fetch(ctx, input.Event.Data.FileURI)
				if err != nil {
					return nil, err
				}
				log.Printf("fetched %d bytes", len(file))
				// ...
				return nil, nil
			})
			if err != nil {
				return nil, err
			}

			return map[string]string{"message": "success"}, nil
		},
	)
}

// !snippet:end
