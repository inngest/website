from .stubs import MINIMUM_ROWS_WORTH_JUDGING, judge_results, sync_data

# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest


# judge_results is a deferred function; sync_data and
# MINIMUM_ROWS_WORTH_JUDGING are your own code
async def sync_function(ctx: inngest.Context) -> None:
    scoring = ctx.defer(
        "judge-results",
        function=judge_results,
        data={"importId": ctx.event.data["importId"]},
    )

    result = await ctx.step.run("sync-data", sync_data, ctx.event.data)

    if result["rowCount"] < MINIMUM_ROWS_WORTH_JUDGING:
        scoring.abort()
# !snippet:end
