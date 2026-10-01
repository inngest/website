from .stubs import inngest_client

# !snippet:start
import httpx
import inngest


@inngest_client.create_function(
    fn_id="load-order",
    trigger=inngest.TriggerEvent(event="shop/order.requested"),
)
async def load_order(ctx: inngest.Context) -> inngest.JSON:
    async def load() -> inngest.JSON:
        async with httpx.AsyncClient() as http:
            response = await http.get(
                f"https://api.example.com/orders/{ctx.event.data['orderId']}"
            )

        if response.status_code == 404:
            raise inngest.NonRetriableError("order does not exist")
        if not response.is_success:
            raise Exception(f"order API returned {response.status_code}")

        return response.json()

    return await ctx.step.run("load-order", load)


# !snippet:end
