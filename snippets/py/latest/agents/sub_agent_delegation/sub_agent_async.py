# !snippet:start
import typing

import httpx
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
    is_async = ctx.event.data.get("isAsync")
    reply_to = ctx.event.data.get("replyTo")

    result = await run_agent_loop(
        ctx,
        system_prompt=f"Complete this task:\n\n{task}",
        session_id=str(ctx.event.data["sessionId"]),
        tools=SUB_AGENT_TOOLS,
        max_iterations=30,
    )

    if is_async and isinstance(reply_to, dict):

        async def deliver_result() -> None:
            if reply_to["type"] == "webhook":
                async with httpx.AsyncClient() as http:
                    res = await http.post(
                        str(reply_to["url"]),
                        json={"response": result["response"]},
                    )
                    res.raise_for_status()

        await ctx.step.run("deliver-result", deliver_result)

    return result


# !snippet:end
