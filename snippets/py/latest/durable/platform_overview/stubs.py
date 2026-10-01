"""Helpers the example calls. Not shown in the docs."""

import typing


async def load_ticket_context(ticket_id: str) -> dict[str, list[str]]:
    return {"history": []}


async def draft_answer(
    context: dict[str, list[str]],
    style: typing.Literal["concise", "detailed"],
) -> str:
    return "..."


async def send_reply(ticket_id: str, answer: str) -> None:
    return None
