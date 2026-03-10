package concurrency

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type Bucket struct {
	Fetch func(uri string) (any, error)
}

func parseFile(any) {

}

func CustomerIDSnippet() {
	bucket := Bucket{}
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})

	// !snippet:start
	type EventData struct {
		CustomerID string `json:"customer_id"`
		FileURI    string `json:"file_uri"`
	}

	_, err := inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			Name: "Process customer csv import",
			ID:   "process-customer-csv-import",
			Concurrency: []inngestgo.ConfigStepConcurrency{
				{
					Limit: 1,
					Key:   inngestgo.StrPtr("event.data.customer_id"), // You can use any piece of data from the event payload
				},
			},
		},
		inngestgo.EventTrigger("csv/file.uploaded", nil),
		func(ctx context.Context, input inngestgo.Input[EventData]) (any, error) {
			_, err := step.Run(ctx, "process-file", func(ctx context.Context) (any, error) {
				file, err := bucket.Fetch(input.Event.Data.FileURI)
				if err != nil {
					return nil, err
				}
				parseFile(file)
				return nil, nil
			})
			if err != nil {
				return err, nil
			}

			return nil, nil
		},
	)
	// !snippet:end

	_ = err
}
