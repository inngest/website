import dataclasses

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@dataclasses.dataclass
class User:
    id: str
    email: str


async def send_welcome_email(email: str) -> None:
    pass


async def create_trial(user_id: str) -> None:
    pass
