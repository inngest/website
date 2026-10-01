# !snippet:start
import datetime

import inngest

inngest_client = inngest.Inngest(app_id="billing")


@inngest_client.create_function(
    fn_id="await-invoice-review",
    trigger=inngest.TriggerEvent(event="invoice/approval.requested"),
)
async def await_invoice_review(ctx: inngest.Context) -> dict[str, str]:
    invoice_id = str(ctx.event.data["invoiceId"])

    review = await ctx.step.wait_for_event(
        "wait-for-review",
        event="invoice/approval.recorded",
        if_exp="event.data.invoiceId == async.data.invoiceId",
        timeout=datetime.timedelta(days=7),
    )

    if review is None:
        return {"invoiceId": invoice_id, "status": "timed-out"}

    return {
        "invoiceId": invoice_id,
        "status": "approved" if review.data["approved"] else "rejected",
    }
# !snippet:end
