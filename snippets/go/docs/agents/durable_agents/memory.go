package durable_agents

import (
	"context"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

type ConversationMessage struct {
	ConversationID string `json:"conversationId"`
	Message        string `json:"message"`
}

func memoryExample(ctx context.Context, input inngestgo.Input[ConversationMessage]) (any, error) {
	var answer, summary string
	// !snippet:start
	history, err := step.Run(ctx, "load-memory", func(ctx context.Context) (Memory, error) {
		return memory.Load(ctx, input.Event.Data.ConversationID)
	})
	if err != nil {
		return nil, err
	}

	// ...run the loop with history + the new message...

	_, err = step.Run(ctx, "save-memory", func(ctx context.Context) (any, error) {
		return nil, memory.Save(ctx, input.Event.Data.ConversationID, map[string]any{
			"answer":  answer,
			"summary": summary,
		})
	})
	// !snippet:end
	_ = history
	return nil, err
}
