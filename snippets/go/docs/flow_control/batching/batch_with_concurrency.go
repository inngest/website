package batching

import (
	"time"

	"github.com/inngest/inngestgo"
)

var batchWithConcurrencyOpts = inngestgo.FunctionOpts{
	ID: "record-activity",
	// !snippet:start
	BatchEvents: &inngestgo.ConfigBatchEvents{
		MaxSize: 5,
		Timeout: 5 * time.Second,
		Key:     inngestgo.StrPtr("event.data.accountId"),
	},
	Concurrency: &inngestgo.ConfigConcurrency{
		Step: []inngestgo.ConfigStepConcurrency{
			{Limit: 1, Key: inngestgo.StrPtr("event.data.accountId")},
		},
	},
	// !snippet:end
}
