package connect

import (
	"context"
	"os"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/connect"
)

func connectWithInstanceID(ctx context.Context, client inngestgo.Client) (connect.WorkerConnection, error) {
	// !snippet:start
	// Set the instance ID to any environment variable that is unique to the worker
	conn, err := inngestgo.Connect(ctx, inngestgo.ConnectOpts{
		Apps:       []inngestgo.Client{client},
		InstanceID: inngestgo.StrPtr(os.Getenv("MY_CONTAINER_ID")),
	})
	// !snippet:end
	return conn, err
}
