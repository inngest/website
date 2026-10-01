import inngest
from inngest.experimental import experiment

from .stubs import feedback_scorer


async def fn(ctx: inngest.Context, ticket_id: str) -> None:
    experiment_ref = experiment.ExperimentRef(
        experiment_name="x", variant="y"
    )
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    # feedback_scorer is a deferred function created with create_defer;
    # experiment_ref comes from `await ctx.group.experiment(...)` earlier in
    # this run
    ctx.defer(
        "score",
        function=feedback_scorer,
        data={"ticketId": ticket_id},
        experiment=experiment_ref,
    )
    # !snippet:end
