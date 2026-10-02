package fan_out

import (
	"context"

	"github.com/inngest/inngestgo"
)

func sendSignup(ctx context.Context, client inngestgo.Client, user User) error {
	// !snippet:start
	_, err := client.Send(ctx, inngestgo.Event{
		Name: "app/user.signed_up",
		Data: map[string]any{"userId": user.ID, "email": user.Email},
	})
	// !snippet:end
	return err
}
