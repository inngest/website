import dataclasses

import fastapi


@dataclasses.dataclass
class Session:
    user_id: str


def get_session(request: fastapi.Request) -> Session:
    return Session(user_id="user_123")


async def assert_user_owns_thread(user_id: str, thread_id: str) -> None:
    return None
