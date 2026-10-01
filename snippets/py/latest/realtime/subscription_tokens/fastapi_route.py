# !snippet:start
# FastAPI
import typing

import fastapi
from inngest.experimental import realtime

from .client import inngest_client
from .stubs import authorize

app = fastapi.FastAPI()


@app.get("/api/realtime-token")
async def realtime_token(
    request: fastapi.Request,
    content_id: typing.Annotated[str, fastapi.Query(alias="contentId")],
) -> typing.Mapping[str, object]:
    # Authorize the user for contentId here.
    await authorize(request, content_id)

    return await realtime.get_subscription_token(
        client=inngest_client,
        channel=f"pipeline:{content_id}",
        topics=["status", "tokens"],
    )
# !snippet:end
