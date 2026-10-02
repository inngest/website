package dev_and_production

import (
	"os"

	"github.com/inngest/inngestgo"
)

func NewClient() (inngestgo.Client, error) {
	// !snippet:start
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "billing",
		// Use the Dev Server everywhere except production.  This overrides INNGEST_DEV.
		Dev: inngestgo.BoolPtr(os.Getenv("APP_ENV") != "production"),
	})
	// !snippet:end
	return client, err
}
