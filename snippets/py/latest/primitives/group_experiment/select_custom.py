import inngest

from .stubs import rollout_table


async def fn(ctx: inngest.Context) -> None:
    async def control() -> str:
        return await ctx.step.run("control", _noop)

    async def _noop() -> str:
        return ""

    variants = {"control": control, "candidate": control}
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    from inngest.experimental import experiment

    # Python has no custom() selector. Read the assignment in a step, then
    # pin it with fixed(). The step memoizes the assignment for the run.
    async def read_assignment() -> str:
        assignment = await rollout_table.get(ctx.event.data["accountId"])
        return assignment or "control"

    assignment = await ctx.step.run("read-assignment", read_assignment)

    res = await ctx.group.experiment(
        "copy-style",
        variants=variants,
        select=experiment.fixed(assignment),
    )
    # !snippet:end
    print(res)
