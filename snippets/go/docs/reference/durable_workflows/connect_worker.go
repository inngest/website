package durable_workflows

// !snippet:start
import (
	"context"
	"log"
	"os/signal"
	"syscall"

	"github.com/inngest/inngestgo"
)

func Worker() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "billing"})
	if err != nil {
		log.Fatal(err)
	}

	// Create your functions with inngestgo.CreateFunction(client, ...) before
	// connecting.  Each one registers itself with the client.

	// Connect opens a WebSocket to Inngest and returns once it's active.
	conn, err := inngestgo.Connect(ctx, inngestgo.ConnectOpts{
		Apps: []inngestgo.Client{client},
	})
	if err != nil {
		log.Fatal(err)
	}

	// Close finishes in-flight steps before it returns.
	<-ctx.Done()
	if err := conn.Close(); err != nil {
		log.Fatal(err)
	}
}

// !snippet:end
