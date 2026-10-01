from .stubs import charge_order, inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="process-order",
    trigger=inngest.TriggerEvent(event="order/created"),
)
async def process_order(ctx: inngest.Context) -> dict[str, object]:
    async def charge() -> dict[str, object]:
        order_id = ctx.event.data["orderId"]
        ctx.logger.info("Charging order", extra={"order_id": order_id})
        return await charge_order(order_id)

    return await ctx.step.run("charge-order", charge)


# !snippet:end
