import dataclasses
import typing


@dataclasses.dataclass
class StreamChunk:
    type: typing.Literal["delta", "completed"]
    delta: str = ""
    output_tokens: int = 0


async def stream_completion(
    *, model: str, prompt: str
) -> typing.AsyncIterator[StreamChunk]:
    yield StreamChunk(type="delta", delta=prompt)
    yield StreamChunk(type="completed", output_tokens=1)
