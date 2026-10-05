package checkpointing

// !snippet:start

import (
	"time"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/pkg/checkpoint"
)

func NewClient() (inngestgo.Client, error) {
	return inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my-app",
		// The default checkpoint config for every function in this app.
		Checkpoint: &checkpoint.Config{
			MaxRuntime: 50 * time.Second, // 50s might be a good option if your max duration is 60s
		},
	})
}

// !snippet:end
