package durable_agents

import (
	"context"

	"github.com/sashabaranov/go-openai"
)

// tools stands in for your tool definitions.
var tools []openai.Tool

// executeTool stands in for your tool code.
func executeTool(ctx context.Context, name string, arguments string) (string, error) {
	panic("unimplemented")
}

type Memory struct {
	Summary string `json:"summary"`
}

type memoryStore struct{}

func (memoryStore) Load(ctx context.Context, conversationID string) (Memory, error) {
	panic("unimplemented")
}

func (memoryStore) Save(ctx context.Context, conversationID string, m map[string]any) error {
	panic("unimplemented")
}

// memory stands in for your own store.
var memory memoryStore
