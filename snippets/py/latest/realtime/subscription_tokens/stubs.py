import dataclasses

import fastapi


@dataclasses.dataclass
class Session:
    user_id: str | None


@dataclasses.dataclass
class Document:
    id: str
    owner_id: str


class _Documents:
    async def find_first(self, *, id: str, owner_id: str) -> Document | None:
        return Document(id=id, owner_id=owner_id)


class _DB:
    documents = _Documents()


db = _DB()


async def get_session() -> Session:
    return Session(user_id="user_123")


async def authorize(request: fastapi.Request, content_id: str) -> None:
    return None
