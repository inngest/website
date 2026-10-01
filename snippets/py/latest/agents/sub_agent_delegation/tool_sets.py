from .stubs import (
    delegate_background_tool,
    delegate_task_tool,
    read_file_tool,
    search_tool,
    write_file_tool,
)

# !snippet:start
# Tools available to the parent agent
PARENT_TOOLS = [
    search_tool,
    read_file_tool,
    write_file_tool,
    delegate_task_tool,  # Can delegate
    delegate_background_tool,  # Can delegate async
]

# Tools available to sub-agents — no delegation
SUB_AGENT_TOOLS = [
    search_tool,
    read_file_tool,
    write_file_tool,
    # No delegate tools — sub-agents cannot spawn further sub-agents
]
# !snippet:end
