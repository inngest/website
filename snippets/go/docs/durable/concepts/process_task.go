package concepts

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

// !snippet:start
type TaskData struct {
	ID string `json:"id"`
}

type TaskResult struct {
	Processed bool   `json:"processed"`
	ID        string `json:"id"`
}

func ProcessTask(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-task"},
		inngestgo.EventTrigger("app/task.created", nil),
		func(ctx context.Context, input inngestgo.Input[TaskData]) (any, error) {
			result, err := step.Run(ctx, "handle-task", func(ctx context.Context) (TaskResult, error) {
				return TaskResult{Processed: true, ID: input.Event.Data.ID}, nil
			})
			if err != nil {
				return nil, err
			}

			step.Sleep(ctx, "pause", time.Second)
			return result, nil
		},
	)
}

// !snippet:end
