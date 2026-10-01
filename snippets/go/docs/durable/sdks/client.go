package sdks

// !snippet:start
import "github.com/inngest/inngestgo"

func NewClient() (inngestgo.Client, error) {
	return inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my-app",
	})
}

// !snippet:end
