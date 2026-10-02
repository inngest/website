package durable_workflows

// !snippet:start
import (
	"log"
	"net/http"

	"github.com/inngest/inngestgo"
)

func Serve() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "billing"})
	if err != nil {
		log.Fatal(err)
	}

	// Create your functions with inngestgo.CreateFunction(client, ...) before
	// serving.  Each one registers itself with the client.

	// Inngest calls this endpoint to run your functions.
	http.Handle("/api/inngest", client.Serve())
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// !snippet:end
