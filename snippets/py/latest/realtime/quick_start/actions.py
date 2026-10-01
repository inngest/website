# !snippet:start
import typing

import fastapi
import inngest
from inngest.experimental import realtime

from .auth import require_current_user
from .client import inngest_client

app = fastapi.FastAPI()


@app.post("/api/realtime/progress-token")
async def get_progress_token(
    request: fastapi.Request,
) -> typing.Mapping[str, object]:
    user = await require_current_user(request)

    return await realtime.get_subscription_token(
        client=inngest_client,
        channel=f"progress:{user.id}",
        topics=["status", "result"],
    )


@app.post("/api/realtime/start")
async def start_demo(request: fastapi.Request) -> None:
    user = await require_current_user(request)

    await inngest_client.send(
        inngest.Event(
            name="demo/progress.requested",
            data={"userId": user.id},
        )
    )
# !snippet:end
