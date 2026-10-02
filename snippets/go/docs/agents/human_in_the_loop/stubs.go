package human_in_the_loop

import (
	"context"
	"net/http"
)

type Draft struct {
	Subject string `json:"subject"`
	Body    string `json:"body"`
}

type GenerateEmailInput struct {
	Recipient string
	Context   string
	Tone      string
}

func generateEmail(ctx context.Context, in GenerateEmailInput) (Draft, error) {
	panic("unimplemented")
}

type SlackMessage struct {
	Channel string
	Text    string
	Blocks  []map[string]any
}

func sendSlackMessage(ctx context.Context, msg SlackMessage) error { panic("unimplemented") }

func sendSlackDM(ctx context.Context, userID string, text string) error { panic("unimplemented") }

type Email struct {
	To      string
	Subject string
	Body    string
}

func sendEmail(ctx context.Context, email Email) error { panic("unimplemented") }

func performAction(ctx context.Context, data ApprovalResponse) (any, error) {
	panic("unimplemented")
}

func handleApproval(approval approvalEvent) (any, error) { panic("unimplemented") }

func currentUserID(r *http.Request) string { panic("unimplemented") }

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ToolCall struct {
	Name      string         `json:"name"`
	Arguments map[string]any `json:"arguments"`
}

type LLMResponse struct {
	Text      string     `json:"text"`
	ToolCalls []ToolCall `json:"toolCalls"`
}

type Tool struct{}

var allTools []Tool

func callLLM(ctx context.Context, messages []Message, tools []Tool) (LLMResponse, error) {
	panic("unimplemented")
}

func executeTool(ctx context.Context, name string, arguments map[string]any) (string, error) {
	panic("unimplemented")
}

type Content struct {
	Title   string `json:"title"`
	Preview string `json:"preview"`
}

func generateContent(ctx context.Context, contentID string) (Content, error) {
	panic("unimplemented")
}

func publishContent(ctx context.Context, content Content) error { panic("unimplemented") }
