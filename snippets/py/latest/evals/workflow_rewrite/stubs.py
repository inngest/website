import typing

from inngest.experimental.experiment import ExperimentRef

Invoice = dict[str, typing.Any]


async def generate_invoice_v1(data: object) -> Invoice:
    return {"id": "inv_1"}


async def draft_invoice_v2(data: object) -> Invoice:
    return {"id": "inv_1"}


async def apply_pricing_v2(draft: Invoice) -> Invoice:
    return draft


async def send_invoice(invoice: Invoice) -> None:
    return None


def validate_invoice(invoice: Invoice) -> bool:
    return True


class _Invoices:
    async def insert(
        self, *, id: str, run_id: str, experiment_ref: dict[str, object]
    ) -> None:
        return None

    async def get(self, id: str) -> dict[str, typing.Any]:
        return {
            "run_id": "01H",
            "experiment_ref": {"experiment_name": "x", "variant": "current"},
        }


class _DB:
    invoices = _Invoices()


db = _DB()
__all__ = ["ExperimentRef"]
