import typing

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def answer_with_current_model() -> str:
    return "current"


async def answer_with_new_model() -> str:
    return "new"


async def generate_invoice_v1(data: typing.Any) -> dict[str, str]:
    return {"id": "inv_1"}


async def generate_invoice_v2(data: typing.Any) -> dict[str, str]:
    return {"id": "inv_2"}


async def send_invoice(invoice: dict[str, str]) -> None:
    return None


async def generate_short_copy(data: typing.Any) -> str:
    return "short"


async def generate_detailed_copy(data: typing.Any) -> str:
    return "detailed"


class _Analytics:
    async def track(self, name: str, properties: dict[str, object]) -> None:
        return None


analytics = _Analytics()


class _RolloutTable:
    async def get(self, key: typing.Any) -> str | None:
        return None


rollout_table = _RolloutTable()


def validate_invoice(invoice: dict[str, str]) -> bool:
    return True
