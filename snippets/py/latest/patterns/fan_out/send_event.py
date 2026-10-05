import inngest

from .stubs import User, inngest_client


async def send_signup(user: User) -> None:
    # !snippet:start
    await inngest_client.send(
        inngest.Event(
            name="app/user.signed_up",
            data={"userId": user.id, "email": user.email},
        )
    )
    # !snippet:end
