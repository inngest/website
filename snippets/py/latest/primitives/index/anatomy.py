import inngest

from .stubs import get_order, send_receipt


async def fn(ctx: inngest.Context) -> None:
    # !snippet:start
    order = await ctx.step.run(
        "load-order", get_order, ctx.event.data["orderId"]
    )

    await ctx.step.run("send-receipt", send_receipt, order)
    # !snippet:end
