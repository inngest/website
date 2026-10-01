package step_sendevent

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func api(ctx context.Context, id string, event inngestgo.Event, events []inngestgo.Event) error {
	// !snippet:start
	// Send one event:
	eventID, err := step.Send(ctx, id, event)

	// Or send several:
	eventIDs, err := step.SendMany(ctx, id, events)
	// !snippet:end
	_, _ = eventID, eventIDs
	return err
}
