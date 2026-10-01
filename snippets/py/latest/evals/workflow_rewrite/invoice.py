# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest
from inngest.experimental import experiment

from .client import inngest_client
from .stubs import (
    Invoice,
    apply_pricing_v2,
    db,
    draft_invoice_v2,
    generate_invoice_v1,
    send_invoice,
    validate_invoice,
)


@inngest_client.create_function(
    fn_id="generate-invoice",
    trigger=inngest.TriggerEvent(event="billing/invoice.requested"),
)
async def generate_invoice(ctx: inngest.Context) -> Invoice:
    data = ctx.event.data

    async def current() -> Invoice:
        async def generate() -> Invoice:
            return await generate_invoice_v1(data)

        invoice = await ctx.step.run("generate-current", generate)

        async def send() -> None:
            await send_invoice(invoice)

        await ctx.step.run("send-current", send)
        return invoice

    async def rewrite() -> Invoice:
        async def draft_invoice() -> Invoice:
            return await draft_invoice_v2(data)

        draft = await ctx.step.run("draft-rewrite", draft_invoice)

        async def price() -> Invoice:
            return await apply_pricing_v2(draft)

        invoice = await ctx.step.run("price-rewrite", price)

        async def send() -> None:
            await send_invoice(invoice)

        await ctx.step.run("send-rewrite", send)
        return invoice

    res = await ctx.group.experiment(
        "invoice-engine",
        variants={"current": current, "rewrite": rewrite},
        # Python has no weighted selector. Bucketing on the run ID sends
        # about one new run in a hundred through the rewrite.
        select=experiment.bucket(
            ctx.run_id, weights={"current": 99, "rewrite": 1}
        ),
    )
    invoice = res.result

    # Save what a later outcome needs to find this run and variant.
    async def save() -> None:
        await db.invoices.insert(
            id=invoice["id"],
            run_id=ctx.run_id,
            experiment_ref=res.experiment_ref.model_dump(),
        )

    await ctx.step.run("save-invoice", save)

    async def score_valid() -> None:
        await inngest_client.score_experiment(
            name="invoice-valid",
            value=validate_invoice(invoice),
            experiment=res.experiment_ref,
            run_id=ctx.run_id,
        )

    await ctx.step.run("score-invoice-valid", score_valid)

    return invoice
# !snippet:end
