CONCISE_PROMPT = "Answer concisely."
DETAILED_PROMPT = "Answer in detail."


async def answer(*, prompt: str, ticket: object) -> str:
    return prompt


async def send_reply(ticket_id: str, answer: str) -> None:
    return None


def is_valid_answer(answer: str) -> bool:
    return bool(answer)
