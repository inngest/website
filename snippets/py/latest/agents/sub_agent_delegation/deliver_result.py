# !snippet:start
import inngest

from .client import inngest_client


# Separate function handles result delivery
@inngest_client.create_function(
    fn_id="deliver-sub-agent-result",
    trigger=inngest.TriggerEvent(event="agent/sub-agent.completed"),
)
async def deliver_sub_agent_result(ctx: inngest.Context) -> None:
    response = str(ctx.event.data["response"])
    parent_session_id = str(ctx.event.data["parentSessionId"])

    await ctx.step.run("deliver", notify_user, parent_session_id, response)


# !snippet:end

from .stubs import notify_user  # noqa: E402
