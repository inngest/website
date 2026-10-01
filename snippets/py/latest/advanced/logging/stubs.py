import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def charge_order(order_id: object) -> dict[str, object]:
    return {}
