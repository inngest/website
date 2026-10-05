from .stubs import create_trial, inngest_client, send_welcome_email

# !snippet:start
import inngest
import pydantic


class UserSignedUp(pydantic.BaseModel):
    userId: str
    email: str


@inngest_client.create_function(
    fn_id="send-welcome-email",
    trigger=inngest.TriggerEvent(event="app/user.signed_up"),
)
async def welcome_email(ctx: inngest.Context) -> None:
    data = UserSignedUp.model_validate(ctx.event.data)

    async def send_email() -> None:
        await send_welcome_email(data.email)

    await ctx.step.run("send-email", send_email)


@inngest_client.create_function(
    fn_id="start-trial",
    trigger=inngest.TriggerEvent(event="app/user.signed_up"),
)
async def trial_setup(ctx: inngest.Context) -> None:
    data = UserSignedUp.model_validate(ctx.event.data)

    async def start_trial() -> None:
        await create_trial(data.userId)

    await ctx.step.run("create-trial", start_trial)


# !snippet:end
