import typing

import inngest

from .stubs import execute_tool


async def parallel_tools(
    ctx: inngest.Context, tool_calls: list[dict[str, typing.Any]]
) -> tuple[dict[str, str], ...]:
    # !snippet:start
    def run_tool(
        idx: int, tool_call: dict[str, typing.Any]
    ) -> typing.Callable[[], typing.Awaitable[dict[str, str]]]:
        async def handler() -> dict[str, str]:
            return {
                "tool_use_id": tool_call["id"],
                "result": await execute_tool(
                    tool_call["name"], tool_call["input"]
                ),
            }

        return lambda: ctx.step.run(f"tool-{tool_call['name']}-{idx}", handler)

    results = await ctx.group.parallel(
        tuple(run_tool(idx, call) for idx, call in enumerate(tool_calls))
    )
    # !snippet:end
    return results
