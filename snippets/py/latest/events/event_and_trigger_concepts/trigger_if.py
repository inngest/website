from .stubs import inngest_client, process_order

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="process-large-order",
    trigger=inngest.TriggerEvent(
        event="shop/order.placed",
        expression="event.data.total > 100",
    ),
)
async def large_order(ctx: inngest.Context) -> object:
    return await process_order(ctx.event.data)


# !snippet:end
