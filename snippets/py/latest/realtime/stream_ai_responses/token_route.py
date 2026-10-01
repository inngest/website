# !snippet:start
# FastAPI
import typing

import fastapi
from inngest.experimental import realtime

from .client import inngest_client
from .stubs import assert_user_owns_thread, get_session

app = fastapi.FastAPI()


class TokenRequest(typing.TypedDict):
    threadId: str


@app.post("/api/ai-token")
async def ai_token(
    request: fastapi.Request, body: TokenRequest
) -> typing.Mapping[str, object]:
    thread_id = body["threadId"]

    # A token is a capability. Check the caller may read this thread first.
    session = get_session(request)
    await assert_user_owns_thread(session.user_id, thread_id)

    return await realtime.get_subscription_token(
        client=inngest_client,
        channel=f"ai-thread:{thread_id}",
        topics=["status", "tokens", "result"],
    )
# !snippet:end
