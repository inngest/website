package step_run

import "context"

type Task struct {
	ID string `json:"id"`
}

type Result struct {
	OK bool `json:"ok"`
}

func loadTask(ctx context.Context, id string) (Task, error)            { return Task{ID: id}, nil }
func processTaskRecord(ctx context.Context, task Task) (Result, error) { return Result{OK: true}, nil }
