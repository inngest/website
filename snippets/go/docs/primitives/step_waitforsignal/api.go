package step_waitforsignal

import (
	"context"
	"time"

	"github.com/inngest/inngestgo/step"
)

func api(ctx context.Context, id string, signal string, timeout time.Duration) error {
	// !snippet:start
	result, err := step.WaitForSignal[map[string]any](ctx, id, step.WaitForSignalOpts{
		Signal:  signal,
		Timeout: timeout,
	})
	// !snippet:end
	_ = result
	return err
}
