package server_side_subscriptions

// !snippet:start
import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo/realtime"
)

// token is a subscription token for the "job:job_123" channel and its
// "status" and "result" topics. The Go SDK can't mint tokens, so mint it
// with the TypeScript or Python SDK.
func readJobUpdates(ctx context.Context, token string) error {
	stream, err := realtime.Subscribe(ctx, token)
	if err != nil {
		return err
	}

	for item := range stream {
		if item.IsErr() {
			return item.Err()
		}
		if !item.IsMessage() {
			continue
		}
		msg := item.Message()
		if msg.Kind == "run" {
			continue
		}
		fmt.Println(msg.Topic, string(msg.Data))
	}
	return nil
}

// !snippet:end

var _ = readJobUpdates
