package connect

import (
	"context"

	"github.com/inngest/inngestgo/connect"
)

func waitForClosed(ctx context.Context, conn connect.WorkerConnection) error {
	// !snippet:start
	// The Go SDK doesn't close the connection on its own. Wait for your
	// shutdown signal (e.g. a context from signal.NotifyContext), then call
	// Close, which returns once the connection is "CLOSED"
	<-ctx.Done()
	if err := conn.Close(); err != nil {
		return err
	}
	// Connection is now closed
	// !snippet:end
	return nil
}
