package sub_agent_delegation

import (
	"context"

	"github.com/sashabaranov/go-openai"
)

type AgentLoopOpts struct {
	SystemPrompt  string
	SessionID     string
	Tools         []openai.Tool
	MaxIterations int
}

type AgentResult struct {
	Response   string `json:"response"`
	Iterations int    `json:"iterations"`
}

// runAgentLoop stands in for your agent loop (see Agent tool loops).
func runAgentLoop(ctx context.Context, opts AgentLoopOpts) (AgentResult, error) {
	panic("unimplemented")
}

type ToolCall struct {
	ID        string         `json:"id"`
	Name      string         `json:"name"`
	Arguments map[string]any `json:"arguments"`
}

type Message struct {
	Role       string     `json:"role"`
	Content    string     `json:"content,omitempty"`
	ToolCalls  []ToolCall `json:"tool_calls,omitempty"`
	ToolCallID string     `json:"tool_call_id,omitempty"`
}

type LLMResponse struct {
	ToolCalls []ToolCall `json:"toolCalls"`
}

func callLLM(ctx context.Context, messages []Message, tools []openai.Tool) (LLMResponse, error) {
	panic("unimplemented")
}

func executeTool(ctx context.Context, name string, arguments map[string]any) (string, error) {
	panic("unimplemented")
}

func notifyUser(ctx context.Context, sessionID string, response string) error {
	panic("unimplemented")
}

const SYSTEM_PROMPT = "You are a helpful assistant."

var (
	searchTool, readFileTool, writeFileTool, delegateBackgroundTool openai.Tool
	TOOLS                                                           []openai.Tool
)
