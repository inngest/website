import typing


async def get_order(order_id: typing.Any) -> dict[str, str]:
    return {"id": str(order_id)}


async def send_receipt(order: dict[str, str]) -> None:
    return None
