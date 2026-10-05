package step_waitforevent

import (
	"context"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func api(ctx context.Context, id string, name string, timeout time.Duration, expression string) error {
	// !snippet:start
	event, err := step.WaitForEvent[inngestgo.Event](ctx, id, step.WaitForEventOpts{
		Event:   name,
		Timeout: timeout,
		If:      &expression,
	})
	// !snippet:end
	_ = event
	return err
}
