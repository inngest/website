import typing

import inngest

from .tool_efficiency import ToolCall


class AgentResult(typing.TypedDict):
    answer: str
    tool_calls: list[ToolCall]


async def run_agent(ctx: inngest.Context, prompt: str) -> AgentResult:
    return {"answer": prompt, "tool_calls": []}
