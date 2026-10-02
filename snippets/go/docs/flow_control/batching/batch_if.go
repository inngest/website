package batching

import (
	"time"

	"github.com/inngest/inngestgo"
)

var conditionalBatchOpts = inngestgo.FunctionOpts{
	ID: "record-activity",
	// !snippet:start
	BatchEvents: &inngestgo.ConfigBatchEvents{
		MaxSize: 5,
		Timeout: 5 * time.Second,
		Key:     inngestgo.StrPtr("event.data.accountId"),
		If:      inngestgo.StrPtr(`event.data.plan == "free"`),
	},
	// !snippet:end
}
