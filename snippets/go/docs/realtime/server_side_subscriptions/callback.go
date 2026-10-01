package server_side_subscriptions

// !snippet:start
import (
	"context"
	"fmt"
	"log"

	"github.com/inngest/inngestgo/realtime"
)

func watchJobStatus(token string) (stop func(), err error) {
	ctx, cancel := context.WithCancel(context.Background())

	stream, err := realtime.Subscribe(ctx, token)
	if err != nil {
		cancel()
		return nil, err
	}

	go func() {
		for item := range stream {
			switch {
			case item.IsErr():
				log.Println("Realtime subscription failed", item.Err())
			case item.IsMessage():
				fmt.Println(string(item.Message().Data))
			}
		}
	}()

	// Later, when you no longer need updates, call stop().
	// Canceling the context closes the connection and the channel.
	return cancel, nil
}

// !snippet:end

var _ = watchJobStatus
