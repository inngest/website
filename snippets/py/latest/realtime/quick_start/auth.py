import dataclasses

import fastapi


@dataclasses.dataclass
class User:
    id: str


async def require_current_user(request: fastapi.Request) -> User:
    return User(id="user_123")
