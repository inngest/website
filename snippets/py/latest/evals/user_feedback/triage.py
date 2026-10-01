# !snippet:start
# Requires the inngest release after 0.5.19.
import datetime
import typing

import inngest
from inngest.experimental import create_defer

from .client import inngest_client
from .stubs import investigate, post_rca


def jaccard(a: list[str], b: list[str]) -> float:
    set_a, set_b = set(a), set(b)
    shared = len(set_a & set_b)
    return shared / ((len(set_a) + len(set_b) - shared) or 1)


@create_defer(inngest_client, fn_id="triage-localization-scorer")
async def triage_scorer(ctx: inngest.Context) -> None:
    incident_id = str(ctx.event.data["incidentId"])
    cited = [str(f) for f in typing.cast(list[object], ctx.event.data["cited"])]

    fix = await ctx.step.wait_for_event(
        "wait-for-fix",
        event="incident/fix.shipped",
        timeout=datetime.timedelta(days=30),
        if_exp=f"async.data.incidentId == '{incident_id}'",
    )
    if fix is None:
        return  # No fix yet: the outcome is unknown.

    fix_files = [str(f) for f in typing.cast(list[object], fix.data["fixFiles"])]
    parent = ctx.parents[0]

    async def write_score() -> None:
        await inngest_client.score(
            name="localization",
            value=jaccard(cited, fix_files),
            run_id=parent.run_id,
        )

    await ctx.step.run("score", write_score)


@inngest_client.create_function(
    fn_id="triage-incident",
    trigger=inngest.TriggerEvent(event="incident/opened"),
)
async def triage_incident(ctx: inngest.Context) -> dict[str, typing.Any]:
    incident_id = str(ctx.event.data["incidentId"])

    async def investigate_step() -> dict[str, typing.Any]:
        return await investigate(ctx.event.data)

    rca = await ctx.step.run("investigate", investigate_step)

    async def post_step() -> None:
        await post_rca(incident_id, rca)

    await ctx.step.run("post-rca", post_step)

    ctx.defer(
        "score-localization",
        function=triage_scorer,
        data={"incidentId": incident_id, "cited": rca["cited_files"]},
    )

    return rca
# !snippet:end
