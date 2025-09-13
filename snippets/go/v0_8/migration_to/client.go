package migration

import (
	"github.com/inngest/inngestgo"
)

func Client() {
	// !snippet:start
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{AppID: "my-app"})
	// !snippet:end

	_ = err
	_ = client
}
