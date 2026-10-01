import typing

import inngest

from .stubs import execute_tool


async def sequential_tools(
    ctx: inngest.Context,
    tool_calls: list[dict[str, typing.Any]],
    tool_results: list[dict[str, typing.Any]],
) -> None:
    # !snippet:start
    for tool_call in tool_calls:
        result = await ctx.step.run(
            f"tool-{tool_call['name']}",
            execute_tool,
            tool_call["name"],
            tool_call["input"],
        )
        tool_results.append(
            {
                "type": "tool_result",
                "tool_use_id": tool_call["id"],
                "content": result,
            }
        )
    # !snippet:end
