package agent_tool_loops

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo/group"
	"github.com/inngest/inngestgo/step"
	"github.com/sashabaranov/go-openai"
)

type ToolResult struct {
	ToolUseID string `json:"toolUseId"`
	Result    string `json:"result"`
}

func parallelTools(ctx context.Context, toolCalls []openai.ToolCall) (group.Results, error) {
	// !snippet:start
	fns := make([]func(ctx context.Context) (any, error), len(toolCalls))
	for idx, toolCall := range toolCalls {
		fns[idx] = func(ctx context.Context) (any, error) {
			return step.Run(ctx, fmt.Sprintf("tool-%s-%d", toolCall.Function.Name, idx), func(ctx context.Context) (ToolResult, error) {
				result, err := executeTool(ctx, toolCall.Function.Name, toolCall.Function.Arguments)
				return ToolResult{ToolUseID: toolCall.ID, Result: result}, err
			})
		}
	}
	results := group.Parallel(ctx, fns...)
	if err := results.AnyError(); err != nil {
		return nil, err
	}
	// !snippet:end
	return results, nil
}
