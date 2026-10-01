package failure_handlers

// !snippet:start

import (
	"context"
	"log"

	"github.com/inngest/inngestgo"
)

type FunctionFailedData struct {
	FunctionID string `json:"function_id"`
	RunID      string `json:"run_id"`
}

func WatchFailures(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "watch-function-failures"},
		inngestgo.EventTrigger("inngest/function.failed", nil),
		func(ctx context.Context, input inngestgo.Input[FunctionFailedData]) (any, error) {
			log.Println("function failed", input.Event.Data.FunctionID, input.Event.Data.RunID)
			return nil, nil
		},
	)
}

// !snippet:end
