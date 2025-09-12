package client

import "github.com/inngest/inngestgo"

func createClientForStoreFrontApp() {
	// !snippet:start

	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "acme-storefront-app",
	})
	if err != nil {
		panic(err)
	}
	// !snippet:end

	_ = client
}
