from .stubs import emails, inngest_client, welcome_email_html

# !snippet:start
import typing

import inngest


# Assumes `emails` is your email provider's client, such as Resend.
@inngest_client.create_function(
    fn_id="send-welcome-email",
    trigger=inngest.TriggerEvent(event="clerk/user.created"),
)
async def send_welcome_email(ctx: inngest.Context) -> object:
    email_addresses = typing.cast(
        list[dict[str, str]], ctx.event.data["email_addresses"]
    )
    email_address = email_addresses[0]["email_address"]

    async def send_email() -> object:
        return await emails.send(
            to=email_address,
            from_="noreply@inngest.com",
            subject="Welcome to Inngest!",
            html=welcome_email_html(),
        )

    return await ctx.step.run("send-email", send_email)


# !snippet:end
