package agent_tool_loops

// !snippet:start
import (
	"context"
	"os"

	"github.com/inngest/inngestgo"
	"github.com/inngest/inngestgo/step"
	"github.com/sashabaranov/go-openai"
)

var llm = openai.NewClient(os.Getenv("OPENAI_API_KEY"))

type MessageReceived struct {
	Message string `json:"message"`
}

func AgentLoop(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "agent-loop"},
		inngestgo.EventTrigger("agent/message.received", nil),
		func(ctx context.Context, input inngestgo.Input[MessageReceived]) (any, error) {
			// Prepare your initial messages w/ system, user prompts
			messages := []openai.ChatCompletionMessage{
				// Use your own expertly crafted prompt:
				{Role: openai.ChatMessageRoleSystem, Content: "You are a helpful assistant with access to tools."},
				{Role: openai.ChatMessageRoleUser, Content: input.Event.Data.Message},
			}

			const maxIterations = 10
			iterations := 0

			for iterations < maxIterations {
				iterations++

				// 1. Think — ask the LLM what to do next
				llmResult, err := step.Run(ctx, "think", func(ctx context.Context) (openai.ChatCompletionResponse, error) {
					return llm.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
						Model:     openai.GPT4o,
						MaxTokens: 4096,
						Messages:  messages,
						Tools:     tools, // your tool definitions
					})
				})
				if err != nil {
					return nil, err
				}
				message := llmResult.Choices[0].Message

				// 2. Check if the LLM wants to use tools
				if len(message.ToolCalls) == 0 {
					// No tools — we're done
					return map[string]any{"response": message.Content, "iterations": iterations}, nil
				}

				// 3. Act — execute each tool
				messages = append(messages, message)
				for _, toolCall := range message.ToolCalls {
					result, err := step.Run(ctx, "tool-"+toolCall.Function.Name, func(ctx context.Context) (string, error) {
						return executeTool(ctx, toolCall.Function.Name, toolCall.Function.Arguments)
					})
					if err != nil {
						return nil, err
					}
					// 4. Observe — feed results back and loop
					messages = append(messages, openai.ChatCompletionMessage{
						Role:       openai.ChatMessageRoleTool,
						ToolCallID: toolCall.ID,
						Content:    result,
					})
				}
			}

			return map[string]any{"response": "Reached iteration limit", "iterations": iterations}, nil
		},
	)
}

// !snippet:end
