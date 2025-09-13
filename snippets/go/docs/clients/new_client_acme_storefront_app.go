package client

// !snippet:start
import "github.com/inngest/inngestgo"

var client, err = inngestgo.NewClient(inngestgo.ClientOpts{
	AppID: "acme-storefront-app",
})

// !snippet:end
