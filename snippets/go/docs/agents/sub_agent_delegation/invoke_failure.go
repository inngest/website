package sub_agent_delegation

import (
	"context"
	"fmt"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
)

func invokeFailure(ctx context.Context, subAgent inngestgo.ServableFunction, toolCall ToolCall, subSessionID string) string {
	// !snippet:start
	var toolResult string
	subResult, err := step.Invoke[AgentResult](ctx, "sub-agent", step.InvokeOpts{
		FunctionId: subAgent.FullyQualifiedID(),
		Data:       map[string]any{"task": toolCall.Arguments["task"], "sessionId": subSessionID},
	})
	if err != nil {
		toolResult = fmt.Sprintf("Sub-agent failed: %s. You may need to handle this task directly.", err)
	} else if subResult.Response != "" {
		toolResult = subResult.Response
	} else {
		toolResult = "(no response)"
	}
	// !snippet:end
	return toolResult
}
