import inngest


async def fn(
    ctx: inngest.Context,
    step_id: str,
    events: inngest.Event | list[inngest.Event],
) -> None:
    # !snippet:start
    ids = await ctx.step.send_event(step_id, events)
    # !snippet:end
    print(ids)
