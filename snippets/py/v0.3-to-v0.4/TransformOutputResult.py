from __future__ import annotations
import typing

Opcode = typing.Any


# !snippet:start
class TransformOutputResult:
    # Mutations to these fields within middleware will be kept after running
    # middleware
    error: typing.Optional[Exception]
    output: object

    # Mutations to these fields within middleware will be discarded after
    # running middleware
    step: typing.Optional[TransformOutputStepInfo]


class TransformOutputStepInfo:
    id: str
    op: Opcode
    opts: typing.Optional[dict[str, object]]


# !snippet:end
