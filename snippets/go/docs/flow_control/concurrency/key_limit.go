package concurrency

import "github.com/inngest/inngestgo"

var perAccountOpts = inngestgo.FunctionOpts{
	ID: "process-import",
	// !snippet:start
	Concurrency: &inngestgo.ConfigConcurrency{
		Step: []inngestgo.ConfigStepConcurrency{
			{
				Limit: 2,
				Key:   inngestgo.StrPtr("event.data.accountId"),
			},
		},
	},
	// !snippet:end
}
