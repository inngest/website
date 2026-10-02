package environments_and_branch_deploys

// !snippet:start
import (
	"net/http"
	"os"

	"github.com/inngest/inngestgo"
)

func main() {
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my-app",
		// Alternatively, you can set the INNGEST_ENV environment variable in your app
		Env: inngestgo.StrPtr(os.Getenv("BRANCH")),
	})
	if err != nil {
		panic(err)
	}

	// Register your functions with inngestgo.CreateFunction(client, ...),
	// then serve them from the client's HTTP handler to complete the setup
	_ = http.ListenAndServe(":8080", client.Serve())
}

// !snippet:end
