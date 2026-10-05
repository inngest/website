package agent_tool_loops

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
