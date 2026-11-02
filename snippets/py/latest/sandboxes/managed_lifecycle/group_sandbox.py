import inngest


async def build(ctx: inngest.Context) -> None:
    # !snippet:start
    async with ctx.group.sandbox("build") as sb:
        await sb.commands.run("test", "npm test")
    # !snippet:end
