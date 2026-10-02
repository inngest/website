package durable_endpoints

// !snippet:start
import "github.com/inngest/inngestgo/stephttp"

// Create one provider when the process starts, and use it for every handler.
var steps = stephttp.Setup(stephttp.SetupOpts{})

// !snippet:end
