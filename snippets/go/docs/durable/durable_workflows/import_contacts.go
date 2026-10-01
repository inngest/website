package durable_workflows

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type CSVUploaded struct {
	FileURI string `json:"fileURI"`
}

func ImportContacts(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	// !snippet:start
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "import-contacts"},
		inngestgo.EventTrigger("contacts/csv.uploaded", nil),
		// The function handler:
		func(ctx context.Context, input inngestgo.Input[CSVUploaded]) (any, error) {
			rows, err := step.Run(ctx, "parse-csv", func(ctx context.Context) ([]Row, error) {
				return parseCsv(ctx, input.Event.Data.FileURI)
			})
			if err != nil {
				return nil, err
			}

			normalizedRows, err := step.Run(ctx, "normalize-raw-csv", func(ctx context.Context) ([]Row, error) {
				normalizedColumnMapping := getNormalizedColumnNames()
				return normalizeRows(rows, normalizedColumnMapping), nil
			})
			if err != nil {
				return nil, err
			}

			results, err := step.Run(ctx, "input-contacts", func(ctx context.Context) (ImportResult, error) {
				return importContacts(ctx, normalizedRows)
			})
			if err != nil {
				return nil, err
			}

			return map[string]any{"results": results}, nil
		},
	)
	// !snippet:end
}
