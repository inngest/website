package agent_tool_loops

import (
	"context"

	"github.com/inngest/inngestgo/step"
	"github.com/sashabaranov/go-openai"
)

func sequentialTools(ctx context.Context, toolCalls []openai.ToolCall, messages []openai.ChatCompletionMessage) ([]openai.ChatCompletionMessage, error) {
	// !snippet:start
	for _, toolCall := range toolCalls {
		result, err := step.Run(ctx, "tool-"+toolCall.Function.Name, func(ctx context.Context) (string, error) {
			return executeTool(ctx, toolCall.Function.Name, toolCall.Function.Arguments)
		})
		if err != nil {
			return nil, err
		}
		messages = append(messages, openai.ChatCompletionMessage{
			Role:       openai.ChatMessageRoleTool,
			ToolCallID: toolCall.ID,
			Content:    result,
		})
	}
	// !snippet:end
	return messages, nil
}
