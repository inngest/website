package group_parallel

// !snippet:start
import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/group"
	"github.com/inngest/inngestgo/step"
)

// `splitTextIntoChunks()`, `summarizeChunk()`, and `summarizeSummaries()`
// are your app's own helpers.

type TextSummarize struct {
	Text string `json:"text"`
}

func SummarizeText(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "summarize-text"},
		inngestgo.EventTrigger("app/text.summarize", nil),
		func(ctx context.Context, input inngestgo.Input[TextSummarize]) (any, error) {
			chunks := splitTextIntoChunks(input.Event.Data.Text)

			fns := make([]func(ctx context.Context) (any, error), len(chunks))
			for index, chunk := range chunks {
				fns[index] = func(ctx context.Context) (any, error) {
					return step.Run(ctx, fmt.Sprintf("summarize-chunk-%d", index), func(ctx context.Context) (string, error) {
						return summarizeChunk(ctx, chunk)
					})
				}
			}

			results := group.Parallel(ctx, fns...)
			if err := results.AnyError(); err != nil {
				return nil, err
			}

			summaries := make([]string, len(results))
			for i, r := range results {
				summaries[i], _ = r.Value.(string)
			}

			return step.Run(ctx, "summarize-summaries", func(ctx context.Context) (string, error) {
				return summarizeSummaries(ctx, summaries)
			})
		},
	)
}

// !snippet:end
