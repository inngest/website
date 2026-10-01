package durable_agents

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

func SupportAgent(client inngestgo.Client) (inngestgo.ServableFunction, error) {
	return inngestgo.CreateFunction(
		client,
		inngestgo.FunctionOpts{ID: "support-agent"},
		inngestgo.EventTrigger("agent/message.received", nil),
		func(ctx context.Context, input inngestgo.Input[MessageReceived]) (any, error) {
			messages := []openai.ChatCompletionMessage{
				{Role: openai.ChatMessageRoleSystem, Content: "You are a support agent with access to tools."},
				{Role: openai.ChatMessageRoleUser, Content: input.Event.Data.Message},
			}

			for i := 0; i < 10; i++ {
				// Think: ask the model what to do next.
				response, err := step.Run(ctx, "think", func(ctx context.Context) (openai.ChatCompletionResponse, error) {
					return llm.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
						Model:     openai.GPT4o,
						MaxTokens: 4096,
						Messages:  messages,
						Tools:     tools,
					})
				})
				if err != nil {
					return nil, err
				}
				message := response.Choices[0].Message

				// No tool calls: the model has answered.
				if len(message.ToolCalls) == 0 {
					return map[string]any{"answer": message.Content}, nil
				}

				// Act: run each tool as its own step.
				messages = append(messages, message)
				for _, call := range message.ToolCalls {
					output, err := step.Run(ctx, "tool-"+call.Function.Name, func(ctx context.Context) (string, error) {
						return executeTool(ctx, call.Function.Name, call.Function.Arguments)
					})
					if err != nil {
						return nil, err
					}
					// Observe: feed the results back and loop.
					messages = append(messages, openai.ChatCompletionMessage{
						Role:       openai.ChatMessageRoleTool,
						ToolCallID: call.ID,
						Content:    output,
					})
				}
			}

			return map[string]any{"answer": "Reached the iteration limit."}, nil
		},
	)
}

// !snippet:end
