package step_sleep

import (
	"context"
	"time"

	"github.com/inngest/inngestgo/step"
)

func api(ctx context.Context, id string, duration time.Duration) {
	// !snippet:start
	step.Sleep(ctx, id, duration)
	// !snippet:end
}
