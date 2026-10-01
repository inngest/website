package performance

import (
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/pkg/checkpoint"
)

func newClient() (inngestgo.Client, error) {
	// !snippet:start
	client, err := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my-app",
		Checkpoint: &checkpoint.Config{
			MaxRuntime: 50 * time.Second, // Example only: use your host's actual limit
		},
	})
	// !snippet:end
	return client, err
}
