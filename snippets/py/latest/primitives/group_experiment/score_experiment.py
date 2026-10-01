import inngest
from inngest.experimental import experiment

from .stubs import inngest_client, validate_invoice


async def fn(ctx: inngest.Context, invoice: dict[str, str]) -> None:
    ref = experiment.ExperimentRef(experiment_name="x", variant="y")
    res = experiment.ExperimentResult(invoice, "y", ref)
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    await inngest_client.score_experiment(
        name="invoice-valid",
        value=validate_invoice(res.result),
        experiment=res.experiment_ref,
        run_id=ctx.run_id,
    )
    # !snippet:end
