package migration

import "github.com/inngest/inngestgo"

// !snippet:start
type MyEventData struct {
	Message string `json:"message"`
}

type MyEvent = inngestgo.GenericEvent[MyEventData]
