package quick_start

// !snippet:start
import "github.com/inngest/inngestgo"

func NewClient() (inngestgo.Client, error) {
	return inngestgo.NewClient(inngestgo.ClientOpts{AppID: "realtime-demo"})
}

// !snippet:end
