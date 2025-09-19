package events

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendEventUserCreated() {
	client, _ := inngestgo.NewClient(inngestgo.ClientOpts{
		AppID: "my_app",
	})
	// !snippet:start
	_, err := client.Send(context.Background(), inngestgo.Event{
		Name: "app/user.created", // This matches the event used in `createFunction`
		Data: map[string]interface{}{
			"email": "test@example.com",
			// any data you want to send
		},
	})
	// !snippet:end
	_ = err
}
