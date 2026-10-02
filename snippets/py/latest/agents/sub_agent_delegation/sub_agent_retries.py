# !snippet:start
import typing

import inngest

from .agent_loop import run_agent_loop
from .client import inngest_client
from .tool_sets import SUB_AGENT_TOOLS


@inngest_client.create_function(
    fn_id="sub-agent",
    retries=1,
    trigger=inngest.TriggerEvent(event="agent/sub-agent.spawn"),
)
async def sub_agent(ctx: inngest.Context) -> dict[str, typing.Any]:
    result = await run_agent_loop(
        ctx,
        system_prompt=f"Complete this task:\n\n{ctx.event.data['task']}",
        session_id=str(ctx.event.data["sessionId"]),
        tools=SUB_AGENT_TOOLS,  # Restricted — always
        max_iterations=20,  # Hard cap on iterations
    )

    return result


# !snippet:end
