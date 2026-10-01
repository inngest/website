package send_events

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendImportedItems(ctx context.Context, client inngestgo.Client) error {
	// !snippet:start
	// This function call might return 10s or 100s of items, so we can map
	// the items into event payloads then pass that slice to SendMany:
	importedItems, err := api.FetchAllItems(ctx)
	if err != nil {
		return err
	}
	events := make([]any, len(importedItems))
	for i, item := range importedItems {
		events[i] = inngestgo.Event{
			Name: "storefront/item.imported",
			Data: item,
		}
	}
	_, err = client.SendMany(ctx, events)
	// !snippet:end
	return err
}
