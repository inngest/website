package send_events

// !snippet:start
import "github.com/inngest/inngestgo"

// NOTE - It is not recommended to hard-code your Event Key in your code.
var client, err = inngestgo.NewClient(inngestgo.ClientOpts{
	AppID:    "your-app-id",
	EventKey: inngestgo.StrPtr("xyz..."),
})

// !snippet:end
