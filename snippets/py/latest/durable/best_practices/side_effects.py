import inngest

from .stubs import User, send_welcome_email


async def side_effects_example(ctx: inngest.Context, user: User) -> None:
    # !snippet:start
    # Don't: runs again every time the function resumes
    await send_welcome_email(user)

    # Do: runs once, and the result is saved
    async def send_email() -> None:
        await send_welcome_email(user)

    await ctx.step.run("send-welcome-email", send_email)
    # !snippet:end
