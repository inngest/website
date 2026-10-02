# !snippet:start
# Requires the inngest release after 0.5.19.
import datetime

import inngest
from inngest.experimental import create_defer

from .client import inngest_client


@create_defer(inngest_client, fn_id="review-scorer")
async def review_scorer(ctx: inngest.Context) -> None:
    parent = ctx.parents[0]
    ticket_id = str(ctx.event.data["ticketId"])

    review = await ctx.step.wait_for_event(
        "wait-for-review",
        event="support/review.completed",
        timeout=datetime.timedelta(days=14),
        if_exp=f"async.data.ticketId == '{ticket_id}'",
    )
    if review is None:
        return

    scores = review.data.get("scores")

    async def write_scores() -> None:
        if not isinstance(scores, dict):
            return
        for name, value in scores.items():
            if not isinstance(value, (bool, int, float)):
                continue
            if parent.experiment is not None:
                await inngest_client.score_experiment(
                    name=name,
                    value=value,
                    experiment=parent.experiment,
                    run_id=parent.run_id,
                )
            else:
                await inngest_client.score(
                    name=name, value=value, run_id=parent.run_id
                )

    await ctx.step.run("write-scores", write_scores)
# !snippet:end
