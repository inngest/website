import inngest


async def fn(ctx: inngest.Context) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    fn_slug, run_id = ctx.parents[0].fn_slug, ctx.parents[0].run_id
    # !snippet:end
    print(fn_slug, run_id)
