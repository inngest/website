import datetime

import inngest


async def wait_for_approval(ctx: inngest.Context) -> dict[str, str] | None:
    # !snippet:start
    approval = await ctx.step.wait_for_event(
        "wait-for-approval",
        event="agent/approval.response",
        if_exp="async.data.approvalId == event.data.approvalId",
        timeout=datetime.timedelta(hours=24),
    )

    if approval is None or not approval.data.get("approved"):
        return {"status": "rejected" if approval else "timed_out"}
    # !snippet:end
    return None
