package working_with_loops

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func ImportPages(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "import-pages"},
		inngestgo.EventTrigger("app/pages.import_requested", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			var cursor *string

			for {
				nextCursor, err := step.Run(ctx, "import-page", func(ctx context.Context) (*string, error) {
					page, err := source.ListPage(ctx, cursor)
					if err != nil {
						return nil, err
					}
					if err := store.UpsertMany(ctx, page.Items); err != nil {
						return nil, err
					}
					return page.NextCursor, nil
				})
				if err != nil {
					return nil, err
				}

				cursor = nextCursor
				if cursor == nil {
					break
				}
			}
			return nil, nil
		},
	)
}

// !snippet:end
