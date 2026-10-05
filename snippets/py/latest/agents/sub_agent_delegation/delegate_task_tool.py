# !snippet:start
delegate_task_tool = {
    "type": "function",
    "function": {
        "name": "delegate_task",
        "description": (
            "Delegate a task to a sub-agent that will work on it "
            "independently and return a result. Use this for tasks that "
            "require deep research, many tool calls, or focused work that "
            "would clutter the current conversation."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "task": {
                    "type": "string",
                    "description": (
                        "A clear, self-contained description of the task. "
                        "Include all necessary context — the sub-agent "
                        "does not have access to this conversation's "
                        "history."
                    ),
                },
            },
            "required": ["task"],
        },
    },
}
# !snippet:end
