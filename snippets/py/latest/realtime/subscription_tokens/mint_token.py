# !snippet:start
import typing

from inngest.experimental import realtime

from .client import inngest_client


async def fetch_ai_token(thread_id: str) -> typing.Mapping[str, object]:
    # Returns {"channel", "topics", "key"}. Send it to the browser.
    return await realtime.get_subscription_token(
        client=inngest_client,
        channel=f"ai-thread:{thread_id}",
        topics=["status", "tokens", "result"],
    )
# !snippet:end
