package connect

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
)

func connectActive(ctx context.Context, client inngestgo.Client) error {
	// !snippet:start
	// Connect returns once the connection is ACTIVE
	conn, err := inngestgo.Connect(ctx, inngestgo.ConnectOpts{
		Apps: []inngestgo.Client{client},
	})
	if err != nil {
		return err
	}
	fmt.Printf("The worker connection is: %s\n", conn.State())
	// The worker connection is: ACTIVE
	// !snippet:end
	return nil
}
