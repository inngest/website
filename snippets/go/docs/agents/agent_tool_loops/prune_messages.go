package agent_tool_loops

import "github.com/sashabaranov/go-openai"

// !snippet:start
func pruneMessages(messages []openai.ChatCompletionMessage, maxMessages int) []openai.ChatCompletionMessage {
	if len(messages) <= maxMessages {
		return messages
	}
	first := messages[0]
	recent := messages[len(messages)-maxMessages+1:]
	return append([]openai.ChatCompletionMessage{first}, recent...)
}

// !snippet:end

var _ = pruneMessages
