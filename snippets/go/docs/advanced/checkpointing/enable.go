package checkpointing

// !snippet:start

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/pkg/checkpoint"
)

func MyFunction(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{
			ID:         "my-function",
			Name:       "My Function",
			Checkpoint: checkpoint.ConfigSafe,
		},
		inngestgo.EventTrigger("app/my.event", nil),
		func(ctx context.Context, input inngestgo.Input[map[string]any]) (any, error) {
			// step.Run results are checkpointed as each step completes
			return nil, nil
		},
	)
}

// !snippet:end
