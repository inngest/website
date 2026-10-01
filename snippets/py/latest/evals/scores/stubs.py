import dataclasses


async def write_answer(message: str) -> str:
    return message


def is_valid_answer(answer: str) -> bool:
    return bool(answer)


@dataclasses.dataclass
class ModelResult:
    text: str
    confidence: float


async def call_model(prompt: str) -> ModelResult:
    return ModelResult(text=prompt, confidence=1.0)
