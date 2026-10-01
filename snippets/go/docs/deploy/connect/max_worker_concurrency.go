package connect

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/connect"
)

func connectWithMaxWorkerConcurrency(ctx context.Context, client inngestgo.Client) (connect.WorkerConnection, error) {
	// !snippet:start
	conn, err := inngestgo.Connect(ctx, inngestgo.ConnectOpts{
		Apps:                 []inngestgo.Client{client},
		MaxWorkerConcurrency: inngestgo.Ptr(int64(10)),
	})
	// !snippet:end
	return conn, err
}
