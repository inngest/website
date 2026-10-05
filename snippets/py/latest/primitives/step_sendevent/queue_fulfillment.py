# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="orders")


@inngest_client.create_function(
    fn_id="queue-fulfillment",
    trigger=inngest.TriggerEvent(event="shop/order.accepted"),
)
async def queue_fulfillment(ctx: inngest.Context) -> dict[str, str]:
    order_id = ctx.event.data["orderId"]

    ids = await ctx.step.send_event(
        "publish-fulfillment-request",
        inngest.Event(
            id=f"fulfillment-request-{order_id}",
            name="shop/fulfillment.requested",
            data={"orderId": order_id},
        ),
    )

    return {"eventId": ids[0]}
# !snippet:end
