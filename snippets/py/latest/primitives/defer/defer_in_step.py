import inngest

from .stubs import send_email


async def fn(ctx: inngest.Context, to: str, body: str) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    # `to` and `body` are your payload values
    async def notify() -> None:
        ctx.defer(
            "send-confirmation",
            function=send_email,
            data={"to": to, "body": body},
        )

    await ctx.step.run("notify", notify)
    # !snippet:end
