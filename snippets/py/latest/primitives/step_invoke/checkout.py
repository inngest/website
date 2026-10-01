# !snippet:start
import datetime

import inngest
import pydantic

inngest_client = inngest.Inngest(app_id="checkout-app")


class CheckoutRequested(pydantic.BaseModel):
    orderId: str
    subtotalCents: int
    shippingCents: int


class TotalInput(pydantic.BaseModel):
    subtotalCents: int
    shippingCents: int


@inngest_client.create_function(
    fn_id="calculate-total",
    # Python functions need a trigger. This event is never sent; the function
    # only runs when it is invoked.
    trigger=inngest.TriggerEvent(event="checkout/calculate-total"),
)
async def calculate_total(ctx: inngest.Context) -> dict[str, int]:
    data = TotalInput.model_validate(ctx.event.data)
    return {"totalCents": data.subtotalCents + data.shippingCents}


@inngest_client.create_function(
    fn_id="prepare-checkout",
    trigger=inngest.TriggerEvent(event="checkout/requested"),
)
async def prepare_checkout(ctx: inngest.Context) -> dict[str, object]:
    event = CheckoutRequested.model_validate(ctx.event.data)

    total = await ctx.step.invoke(
        "calculate-total",
        function=calculate_total,
        data={
            "subtotalCents": event.subtotalCents,
            "shippingCents": event.shippingCents,
        },
        timeout=datetime.timedelta(minutes=5),
    )

    return {
        "orderId": event.orderId,
        "totalCents": total["totalCents"],
    }


functions = [calculate_total, prepare_checkout]
# !snippet:end
