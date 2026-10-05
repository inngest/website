import inngest

inngest_client = inngest.Inngest(app_id="support")


async def handler(ctx: inngest.Context, team: str) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    known_team = ctx.event.data.get("knownTeam")
    if known_team:

        async def score_routing() -> None:
            await inngest_client.score(
                name="routing-accuracy",
                value=1 if team == known_team else 0,
                run_id=ctx.run_id,
            )

        await ctx.step.run("score-routing-accuracy", score_routing)
    # !snippet:end
