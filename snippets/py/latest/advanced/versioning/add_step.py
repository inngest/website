import inngest

from .stubs import analytics, crm, send_welcome_email


async def handler(ctx: inngest.Context) -> None:
    # !snippet:start
    async def send_email() -> None:
        await send_welcome_email(ctx.event.data["email"])

    async def track_signup() -> None:
        await analytics.track("user_signup_complete", ctx.event.data)

    async def sync_to_crm() -> None:
        await crm.contacts.create(ctx.event.data)

    await ctx.step.run("send-welcome-email", send_email)
    await ctx.step.run("track-signup", track_signup)
    await ctx.step.run("sync-to-crm", sync_to_crm)
    # !snippet:end
