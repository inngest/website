package functions

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func loadSyncDataInngestFn(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(client,
		inngestgo.FunctionOpts{ID: "sync-systems"},
		// Functions are triggered by events
		inngestgo.EventTrigger("auto/sync.request", nil),
		func(ctx context.Context, input inngestgo.Input[SyncRequestEvent]) (any, error) {
			// By wrapping code in step.run, the code will be retried if it throws an error and when successfuly.
			// It's result is saved to prevent unnecessary re-execution
			data, err := step.Run(ctx, "get-data", func(ctx context.Context) (any, error) {
				return getDataFromExternalSource()
			})
			if err != nil {
				return nil, err
			}

			// steps can reuse data from previous ones
			// can also be retried up to 4 times
			_, err = step.Run(ctx, "save-data", func(ctx context.Context) (any, error) {
				return InsertIntoDB(data.(DataType))
			})
			if err != nil {
				return nil, err
			}

			return nil, nil
		},
	)
}

// !snippet:end

func getDataFromExternalSource() (any, error) {
	panic("unimplemented")
}

func InsertIntoDB(data DataType) (any, error) {
	panic("unimplemented")
}

type DataType struct {
}

type SyncRequestEvent struct {
	ID string
}
