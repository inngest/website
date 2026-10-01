package working_with_loops

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ImportRequestedData struct {
	ItemIDs []string `json:"itemIds"`
}

func ImportItems(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "import-items"},
		inngestgo.EventTrigger("app/items.import_requested", nil),
		func(ctx context.Context, input inngestgo.Input[ImportRequestedData]) (any, error) {
			for _, itemID := range input.Event.Data.ItemIDs {
				_, err := step.Run(ctx, "process-item", func(ctx context.Context) (any, error) {
					return processItem(ctx, itemID)
				})
				if err != nil {
					return nil, err
				}
			}
			return nil, nil
		},
	)
}

// !snippet:end
