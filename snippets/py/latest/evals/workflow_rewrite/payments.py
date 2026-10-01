# !snippet:start
# Requires the inngest release after 0.5.19.
import typing

import inngest
from inngest.experimental.experiment import ExperimentRef

from .client import inngest_client
from .stubs import db


@inngest_client.create_function(
    fn_id="score-invoice-paid",
    trigger=inngest.TriggerEvent(event="billing/invoice.paid"),
)
async def score_payment(ctx: inngest.Context) -> None:
    invoice_id = str(ctx.event.data["invoiceId"])

    async def load() -> dict[str, typing.Any]:
        return await db.invoices.get(invoice_id)

    saved = await ctx.step.run("load-invoice", load)

    async def score_paid() -> None:
        await inngest_client.score_experiment(
            name="invoice-paid",
            value=True,
            experiment=ExperimentRef.model_validate(saved["experiment_ref"]),
            run_id=saved["run_id"],
        )

    await ctx.step.run("score-invoice-paid", score_paid)
# !snippet:end
