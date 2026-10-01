import datetime
import typing

import inngest

from .stubs import perform_action


async def three_outcomes(ctx: inngest.Context) -> dict[str, typing.Any]:
    # !snippet:start
    approval = await ctx.step.wait_for_event(
        "wait-for-approval",
        event="agent/approval.response",
        if_exp="async.data.approvalId == event.data.approvalId",
        timeout=datetime.timedelta(hours=24),
    )

    if approval is None:
        # TIMEOUT: No response within the window
        return {"status": "timed_out"}

    if approval.data.get("approved"):
        # APPROVED: Proceed with the action
        result = await ctx.step.run(
            "execute-action", perform_action, approval.data
        )
        return {"status": "approved", "result": result}

    # REJECTED
    return {"status": "rejected", "reason": approval.data.get("reason")}
    # !snippet:end
