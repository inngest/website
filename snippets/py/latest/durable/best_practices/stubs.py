import dataclasses


@dataclasses.dataclass
class User:
    email: str


async def send_welcome_email(user: User) -> None:
    pass


class _Payments:
    async def charge(
        self, *, amount: int, idempotency_key: str
    ) -> dict[str, str]:
        return {"id": "ch_123"}


payments = _Payments()
