# !snippet:start
import typing

from inngest.experimental import realtime

from .client import inngest_client
from .stubs import db, get_session


async def fetch_document_token(
    document_id: str,
) -> typing.Mapping[str, object]:
    session = await get_session()
    if session.user_id is None:
        raise PermissionError("Not authenticated")

    # Confirm this user may read this document before minting a token for it.
    document = await db.documents.find_first(
        id=document_id, owner_id=session.user_id
    )
    if document is None:
        raise LookupError("Not found")

    return await realtime.get_subscription_token(
        client=inngest_client,
        channel=f"document:{document_id}",
        # Grant only the topics this view needs.
        topics=["status", "result"],
    )
# !snippet:end
