import typing

import inngest


async def send_slack_message(
    *,
    channel: str,
    text: str | None = None,
    blocks: list[dict[str, typing.Any]] | None = None,
) -> None:
    raise NotImplementedError


async def send_slack_dm(*, user_id: str, text: str) -> None:
    raise NotImplementedError


async def perform_action(data: typing.Mapping[str, typing.Any]) -> str:
    raise NotImplementedError


def handle_approval(approval: inngest.Event) -> dict[str, typing.Any]:
    raise NotImplementedError
