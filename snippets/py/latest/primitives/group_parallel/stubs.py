import typing

import inngest


async def send_email(email: typing.Any) -> str:
    return "email-id"


def send_email_sync(email: typing.Any) -> str:
    return "email-id"


class _DB:
    async def update_user_with_charge(
        self, event: inngest.Event
    ) -> dict[str, bool]:
        return {"updated": True}

    def update_user_with_charge_sync(
        self, event: inngest.Event
    ) -> dict[str, bool]:
        return {"updated": True}


db = _DB()


def split_text_into_chunks(text: typing.Any) -> list[str]:
    return [str(text)]


async def summarize_chunk(chunk: str) -> str:
    return chunk


async def summarize_summaries(summaries: list[str]) -> str:
    return " ".join(summaries)
