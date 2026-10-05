package sub_agent_delegation

import "github.com/sashabaranov/go-openai"

// !snippet:start
// Tools available to the parent agent
var PARENT_TOOLS = []openai.Tool{
	searchTool,
	readFileTool,
	writeFileTool,
	delegateTaskTool,       // Can delegate
	delegateBackgroundTool, // Can delegate async
}

// Tools available to sub-agents — no delegation
var SUB_AGENT_TOOLS = []openai.Tool{
	searchTool,
	readFileTool,
	writeFileTool,
	// No delegate tools — sub-agents cannot spawn further sub-agents
}

// !snippet:end
