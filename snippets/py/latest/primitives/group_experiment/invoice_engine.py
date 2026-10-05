import inngest
from inngest.experimental import experiment

from .stubs import generate_invoice_v1, generate_invoice_v2, send_invoice


async def fn(ctx: inngest.Context) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    async def current() -> dict[str, str]:
        invoice = await ctx.step.run(
            "generate-current", generate_invoice_v1, ctx.event.data
        )
        await ctx.step.run("send-current", send_invoice, invoice)
        return invoice

    async def rewrite() -> dict[str, str]:
        invoice = await ctx.step.run(
            "generate-rewrite", generate_invoice_v2, ctx.event.data
        )
        await ctx.step.run("send-rewrite", send_invoice, invoice)
        return invoice

    res = await ctx.group.experiment(
        "invoice-engine",
        variants={"current": current, "rewrite": rewrite},
        select=experiment.bucket(
            ctx.run_id, weights={"current": 99, "rewrite": 1}
        ),
    )
    # !snippet:end
    print(res.result, res.experiment_ref)
