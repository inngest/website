package step_run

// !snippet:start
import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type TaskCreated struct {
	TaskID string `json:"taskId"`
}

func ProcessTask(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "process-task"},
		inngestgo.EventTrigger("app/task.created", nil),
		func(ctx context.Context, input inngestgo.Input[TaskCreated]) (any, error) {
			task, err := step.Run(ctx, "load-task", func(ctx context.Context) (Task, error) {
				return loadTask(ctx, input.Event.Data.TaskID)
			})
			if err != nil {
				return nil, err
			}

			return step.Run(ctx, "process-task", func(ctx context.Context) (Result, error) {
				return processTaskRecord(ctx, task)
			})
		},
	)
}

// !snippet:end
