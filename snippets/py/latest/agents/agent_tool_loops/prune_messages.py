# !snippet:start
import typing


def prune_messages(
    messages: list[dict[str, typing.Any]], max_messages: int
) -> list[dict[str, typing.Any]]:
    if len(messages) <= max_messages:
        return messages
    first = messages[0]
    recent = messages[-max_messages + 1 :]
    return [first, *recent]


# !snippet:end
