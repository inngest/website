package agent_tool_loops

import (
	"context"

	"github.com/inngest/inngestgo/step"
	"github.com/sashabaranov/go-openai"
)

func tokenUsage(ctx context.Context, req openai.ChatCompletionRequest) (any, error) {
	const maxIterations = 10
	iterations := 0
	done := false
	// !snippet:start
	totalInputTokens := 0

	for !done && iterations < maxIterations {
		llmResult, err := step.Run(ctx, "think", func(ctx context.Context) (openai.ChatCompletionResponse, error) {
			return llm.CreateChatCompletion(ctx, req)
		})
		if err != nil {
			return nil, err
		}

		totalInputTokens += llmResult.Usage.PromptTokens
		if totalInputTokens > 500_000 {
			return map[string]any{"response": "Token budget exceeded", "iterations": iterations}, nil
		}

		// ... rest of loop
	}
	// !snippet:end
	return nil, nil
}
