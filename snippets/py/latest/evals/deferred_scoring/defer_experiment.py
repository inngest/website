import inngest
from inngest.experimental.experiment import ExperimentRef

from .scorer import feedback_scorer


def handler(ctx: inngest.Context, experiment_ref: ExperimentRef) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    ctx.defer(
        "score-feedback",
        function=feedback_scorer,
        data={"ticketId": ctx.event.data["ticketId"]},
        experiment=experiment_ref,
    )
    # !snippet:end
