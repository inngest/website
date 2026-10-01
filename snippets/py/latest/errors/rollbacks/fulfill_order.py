from .stubs import (
    charge_order,
    inngest_client,
    release_inventory,
    reserve_inventory,
)

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="fulfill-order",
    trigger=inngest.TriggerEvent(event="shop/order.placed"),
)
async def fulfill_order(ctx: inngest.Context) -> None:
    order_id = ctx.event.data["orderId"]

    async def reserve() -> str:
        return await reserve_inventory(order_id)

    reservation_id = await ctx.step.run("reserve-inventory", reserve)

    async def charge() -> None:
        await charge_order(order_id)

    async def release() -> None:
        await release_inventory(reservation_id)

    try:
        await ctx.step.run("charge-order", charge)
    except inngest.StepError:
        await ctx.step.run("release-inventory", release)
        raise


# !snippet:end
