import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def load_order(order_id: str) -> dict[str, str]:
    return {"id": order_id}


async def charge_order(order: dict[str, str]) -> None:
    pass


async def send_receipt(order: dict[str, str]) -> None:
    pass


async def refund_order(order: dict[str, str]) -> None:
    pass


async def parse_csv(file_uri: str) -> list[dict[str, str]]:
    return []


def get_normalized_column_names() -> dict[str, str]:
    return {}


def normalize_rows(
    rows: list[dict[str, str]], mapping: dict[str, str]
) -> list[dict[str, str]]:
    return rows


async def import_contacts(rows: list[dict[str, str]]) -> dict[str, int]:
    return {"imported": len(rows)}
