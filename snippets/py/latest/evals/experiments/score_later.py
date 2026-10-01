from .client import inngest_client
from .stubs import Saved


async def on_invoice_paid(saved: Saved) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    await inngest_client.score_experiment(
        name="invoice-paid",
        value=True,
        experiment=saved.experiment_ref,
        run_id=saved.run_id,
    )
    # !snippet:end
