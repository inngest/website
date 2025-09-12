package client

// !snippet:start
import "github.com/inngest/inngestgo"

// !snippet:end

func createClientForStoreFrontApp() {
	// !snippet:start

	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "acme-storefront-app",
	})
	if err != nil {
		panic(err)
	}
	// !snippet:end
}
