package concurrency

// !snippet:start
import (
	"github.com/inngest/inngest/pkg/enums"
	"github.com/inngest/inngestgo"
)

var opts = inngestgo.FunctionOpts{
	ID: "process-import",
	Concurrency: &inngestgo.ConfigConcurrency{
		Step: []inngestgo.ConfigStepConcurrency{
			{
				Scope: enums.ConcurrencyScopeAccount,
				Key:   inngestgo.StrPtr(`"external-api"`),
				Limit: 20,
			},
		},
	},
}

// !snippet:end
