import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def reserve_inventory(order_id: object) -> str:
    return "res_1"


async def charge_order(order_id: object) -> None:
    pass


async def release_inventory(reservation_id: str) -> None:
    pass
