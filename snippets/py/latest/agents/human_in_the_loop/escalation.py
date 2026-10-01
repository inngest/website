import datetime
import typing

import inngest

from .stubs import handle_approval, send_slack_dm


async def escalation(
    ctx: inngest.Context, action_summary: str
) -> dict[str, typing.Any] | None:
    # !snippet:start
    approval = await ctx.step.wait_for_event(
        "wait-for-approval",
        event="agent/approval.response",
        if_exp="async.data.approvalId == event.data.approvalId",
        timeout=datetime.timedelta(hours=4),
    )

    if approval is None:

        async def escalate_to_manager() -> None:
            await send_slack_dm(
                user_id=str(ctx.event.data["escalationContact"]),
                text=(
                    "⚠️ Approval needed — original reviewer didn't respond "
                    f"in 4 hours.\n\n{action_summary}"
                ),
            )

        await ctx.step.run("escalate-to-manager", escalate_to_manager)

        escalated_approval = await ctx.step.wait_for_event(
            "wait-for-escalation",
            event="agent/approval.response",
            if_exp="async.data.approvalId == event.data.approvalId",
            timeout=datetime.timedelta(hours=4),
        )

        if escalated_approval is None:
            return {"status": "timed_out", "escalated": True}

        return handle_approval(escalated_approval)
    # !snippet:end
    return None
