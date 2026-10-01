package group_parallel

import (
	"context"

	"github.com/inngest/inngestgo"
)

type UserUpdate struct {
	Updated bool `json:"updated"`
}

type database struct{}

func (database) UpdateUserWithCharge(ctx context.Context, evt inngestgo.GenericEvent[ChargeCreated]) (UserUpdate, error) {
	return UserUpdate{Updated: true}, nil
}

var db database

func sendEmail(ctx context.Context, email string) (string, error) { return "email-id", nil }

func splitTextIntoChunks(text string) []string                         { return []string{text} }
func summarizeChunk(ctx context.Context, chunk string) (string, error) { return chunk, nil }
func summarizeSummaries(ctx context.Context, s []string) (string, error) {
	return "", nil
}
