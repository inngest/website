package connect

// !snippet:start
import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"os/signal"
	"syscall"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/connect"
)

func runWorker(client inngestgo.Client) error {
	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	conn, err := inngestgo.Connect(ctx, inngestgo.ConnectOpts{
		Apps: []inngestgo.Client{client},
	})
	if err != nil {
		return err
	}
	fmt.Println("Worker: connected")

	// This is a basic web server that only listens for the /ready endpoint
	// and returns a 200 status code when the connection to Inngest is active.
	mux := http.NewServeMux()
	mux.HandleFunc("/ready", func(w http.ResponseWriter, r *http.Request) {
		if conn.State() == connect.ConnectionStateActive {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte("OK"))
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		_, _ = w.Write([]byte("NOT OK"))
	})
	httpServer := &http.Server{Addr: ":8080", Handler: mux}

	// Start the server on a port of your choice
	go func() {
		fmt.Println("Worker: HTTP server listening on port 8080")
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			fmt.Printf("HTTP server error: %s\n", err)
		}
	}()

	// When a shutdown signal is received, gracefully close the Inngest
	// connection. Close returns once the connection is closed.
	<-ctx.Done()
	if err := conn.Close(); err != nil {
		return err
	}
	fmt.Println("Worker: Shut down")

	// Stop the HTTP server
	return httpServer.Shutdown(context.Background())
}

// !snippet:end
