# !snippet:start
# Requires the inngest release after 0.5.19.
import datetime

import inngest
from inngest.experimental import create_defer

from .client import inngest_client


@create_defer(inngest_client, fn_id="feedback-scorer")
async def feedback_scorer(ctx: inngest.Context) -> None:
    ticket_id = str(ctx.event.data["ticketId"])

    feedback = await ctx.step.wait_for_event(
        "wait-for-feedback",
        event="support/feedback.received",
        timeout=datetime.timedelta(days=7),
        if_exp=f"async.data.ticketId == '{ticket_id}'",
    )
    if feedback is None:
        return  # Write nothing: the outcome is unknown.

    # Python scorers write the score themselves. The run that called
    # ctx.defer(), and its experiment variant, are on ctx.parents[0].
    parent = ctx.parents[0]
    helpful = feedback.data.get("helpful") is True

    async def write_score() -> None:
        if parent.experiment is not None:
            await inngest_client.score_experiment(
                name="customer-helpful",
                value=helpful,
                experiment=parent.experiment,
                run_id=parent.run_id,
            )
        else:
            await inngest_client.score(
                name="customer-helpful", value=helpful, run_id=parent.run_id
            )

    await ctx.step.run("score", write_score)
# !snippet:end
