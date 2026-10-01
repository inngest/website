import typing

import anthropic

llm = anthropic.AsyncAnthropic()

# Stand-ins for your tool definitions and tool code.
tools: list[dict[str, typing.Any]] = []


async def execute_tool(name: str, tool_input: dict[str, typing.Any]) -> str:
    raise NotImplementedError
