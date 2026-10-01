package step_invoke

import (
	"context"
	"time"

	"github.com/inngest/inngestgo/step"
)

func api(ctx context.Context, id string, functionID string, data map[string]any, timeout time.Duration) error {
	// !snippet:start
	// functionID is the full ID: "<app-id>-<function-id>".
	result, err := step.Invoke[map[string]any](ctx, id, step.InvokeOpts{
		FunctionId: functionID,
		Data:       data,
		Timeout:    timeout,
	})
	// !snippet:end
	_ = result
	return err
}
