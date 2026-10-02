package sub_agent_delegation

// !snippet:start
import "github.com/sashabaranov/go-openai"

var delegateTaskTool = openai.Tool{
	Type: openai.ToolTypeFunction,
	Function: &openai.FunctionDefinition{
		Name: "delegate_task",
		Description: "Delegate a task to a sub-agent that will work on it independently and return a result. " +
			"Use this for tasks that require deep research, many tool calls, or focused work " +
			"that would clutter the current conversation.",
		Parameters: map[string]any{
			"type": "object",
			"properties": map[string]any{
				"task": map[string]any{
					"type": "string",
					"description": "A clear, self-contained description of the task. Include all necessary context — " +
						"the sub-agent does not have access to this conversation's history.",
				},
			},
			"required": []string{"task"},
		},
	},
}

// !snippet:end
