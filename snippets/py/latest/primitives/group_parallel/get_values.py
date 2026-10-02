# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="parallel-example")


@inngest_client.create_function(
    fn_id="get-values",
    trigger=inngest.TriggerEvent(event="app/values.requested"),
)
async def get_values(ctx: inngest.Context) -> dict[str, object]:
    async def load_profile() -> dict[str, str]:
        return {"id": "user-123"}

    async def load_orders() -> list[dict[str, str]]:
        return [{"id": "order-456"}]

    profile, orders = await ctx.group.parallel(
        (
            lambda: ctx.step.run("load-profile", load_profile),
            lambda: ctx.step.run("load-orders", load_orders),
        )
    )

    return {"profile": profile, "orders": orders}
# !snippet:end
