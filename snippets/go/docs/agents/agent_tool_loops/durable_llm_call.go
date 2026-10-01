package agent_tool_loops

import (
	"context"

	"github.com/inngest/inngestgo/step"
	"github.com/sashabaranov/go-openai"
)

func durableLLMCall(ctx context.Context, req openai.ChatCompletionRequest) error {
	// !snippet:start
	// ✅ Durable — retries on failure, result is checkpointed
	result, err := step.Run(ctx, "think", func(ctx context.Context) (openai.ChatCompletionResponse, error) {
		return llm.CreateChatCompletion(ctx, req)
	})

	// ❌ Not durable — if this fails, you lose all prior work
	result, err = llm.CreateChatCompletion(ctx, req)
	// !snippet:end
	_ = result
	return err
}
