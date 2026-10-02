package concurrency

import (
	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

var multipleLimitsOpts = inngestgo.FunctionOpts{
	ID: "process-import",
	// !snippet:start
	Concurrency: &inngestgo.ConfigConcurrency{
		Step: []inngestgo.ConfigStepConcurrency{
			{
				Scope: enums.ConcurrencyScopeAccount,
				Key:   inngestgo.StrPtr(`"external-api"`),
				Limit: 20,
			},
			{
				Key:   inngestgo.StrPtr("event.data.accountId"),
				Limit: 2,
			},
		},
	},
	// !snippet:end
}
