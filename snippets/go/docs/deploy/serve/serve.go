package serve

// !snippet:start
import (
	"net/http"

	"github.com/inngest/inngestgo"
)

// Functions created with inngestgo.CreateFunction(client, ...) are
// registered on the client. client.Serve() returns an http.Handler
// that serves all of them.
func serve(client inngestgo.Client) error {
	http.Handle("/api/inngest", client.Serve())
	return http.ListenAndServe(":8080", nil)
}

// !snippet:end
