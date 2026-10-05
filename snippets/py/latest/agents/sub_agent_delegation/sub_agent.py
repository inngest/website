# !snippet:start
import typing

import inngest

from .agent_loop import run_agent_loop
from .client import inngest_client
from .tool_sets import SUB_AGENT_TOOLS


@inngest_client.create_function(
    fn_id="sub-agent",
    trigger=inngest.TriggerEvent(event="agent/sub-agent.spawn"),
)
async def sub_agent(ctx: inngest.Context) -> dict[str, typing.Any]:
    task = ctx.event.data["task"]
    session_id = str(ctx.event.data["sessionId"])

    system_prompt = (
        "You are a focused sub-agent. Complete the following task and "
        f"return a clear, concise result.\n\nTask: {task}"
    )

    result = await run_agent_loop(
        ctx,
        system_prompt=system_prompt,
        session_id=session_id,
        # No delegation tools — see "Prevent recursion"
        tools=SUB_AGENT_TOOLS,
        max_iterations=20,
    )

    return {
        "response": result["response"],
        "iterations": result["iterations"],
    }


# !snippet:end
