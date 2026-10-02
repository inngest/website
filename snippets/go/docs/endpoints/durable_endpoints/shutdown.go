package durable_endpoints

// !snippet:start
import (
	"context"
	"net/http"

	"github.com/inngest/inngestgo/stephttp"
)

func Shutdown(ctx context.Context, srv *http.Server, steps stephttp.Provider) error {
	// Stop accepting requests, and let in-flight requests finish.
	err := srv.Shutdown(ctx)

	// Wait for finished runs to reach Inngest, or for ctx to end.
	select {
	case <-steps.Wait(ctx):
	case <-ctx.Done():
	}
	return err
}

// !snippet:end
