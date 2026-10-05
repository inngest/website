package creating_middleware

// !snippet:start
import (
	"context"
	"log/slog"
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/middleware"
)

// StepTimingMiddleware records how long the new code in each request takes to
// run. Go middleware hooks run around new code (usually one step.Run
// callback) rather than around a specific step handler.
type StepTimingMiddleware struct {
	middleware.BaseMiddleware
	startedAt time.Time
}

func NewStepTimingMiddleware() middleware.Middleware {
	return &StepTimingMiddleware{}
}

func (m *StepTimingMiddleware) BeforeExecution(ctx context.Context, call middleware.CallContext) {
	m.startedAt = time.Now()
}

func (m *StepTimingMiddleware) AfterExecution(
	ctx context.Context,
	call middleware.CallContext,
	result any,
	err error,
) {
	slog.Info("step duration",
		"runId", call.RunID,
		"attempt", call.Attempt,
		"durationMs", time.Since(m.startedAt).Milliseconds(),
	)
}

func NewClient() (inngestgo.Client, error) {
	return inngestgo.NewClient(inngestgo.ClientOpts{
		AppID:      "my-app",
		Middleware: []func() middleware.Middleware{NewStepTimingMiddleware},
	})
}

// !snippet:end
