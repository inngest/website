import typing
import dataclasses

# !snippet:start
import inngest
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse

inngest_client = inngest.Inngest(app_id="my-app")
app = FastAPI()

@app.post("/signup")
async def signup(request: Request):
    # NOTE - this code is simplified for the example:
    data = await request.json()
    email = data["email"]
    password = data["password"]

    user = await create_user(email=email, password=password)
    await create_session(user.id)

    # Send an event to Inngest
    await inngest_client.send(
        inngest.Event(
            name="app/user.signup",
            data={"id": user.id, "email": user.email},
        )
    )

    return RedirectResponse(url="https://myapp.com/dashboard")


# !snippet:end


@dataclasses.dataclass
class User:
    email: str
    id: int


async def create_user(email: typing.Any, password: typing.Any) -> User:
    return User(email="", id=0)


def create_session(user_id: int) -> typing.Any:
    return None
