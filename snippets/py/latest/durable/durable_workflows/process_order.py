from .stubs import (
    charge_order,
    inngest_client,
    load_order,
    refund_order,
    send_receipt,
)

# !snippet:start
import datetime

import inngest


@inngest_client.create_function(
    fn_id="process-order",
    # any time the `shop/order.placed` event is received, this will run.
    trigger=inngest.TriggerEvent(event="shop/order.placed"),
)
async def process_order(ctx: inngest.Context) -> dict[str, str]:
    async def load() -> dict[str, str]:
        return await load_order(str(ctx.event.data["orderId"]))

    order = await ctx.step.run("load-order", load)

    async def charge() -> None:
        await charge_order(order)

    await ctx.step.run("charge-order", charge)

    async def receipt() -> None:
        await send_receipt(order)

    await ctx.step.run("send-receipt", receipt)

    # this will wait for the `shop/order.cancelled` event for up to 6 hours,
    # and resume immediately when a matching event is received.  If an event
    # isn't received within 6 hours, the function resumes and the
    # `cancellation` variable is None.
    #
    # your compute is *not running* during this wait, and you do not need to
    # handle any matching.
    cancellation = await ctx.step.wait_for_event(
        "wait-for-cancellation",
        event="shop/order.cancelled",
        if_exp="event.data.orderId == async.data.orderId",
        timeout=datetime.timedelta(hours=6),
    )

    if cancellation is not None:
        # the order was cancelled, as we received a cancel event
        async def refund() -> None:
            await refund_order(order)

        await ctx.step.run("refund-order", refund)
        return {"orderId": order["id"], "status": "cancelled"}

    return {"orderId": order["id"]}


# !snippet:end
