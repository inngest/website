import json
import typing

from .judge import Score


# !snippet:start
class ToolCall(typing.TypedDict):
    name: str
    input: object


def score_tool_efficiency(tool_calls: list[ToolCall]) -> Score:
    keys = [f"{c['name']}({json.dumps(c['input'])})" for c in tool_calls]
    value = 1.0 if not tool_calls else len(set(keys)) / len(keys)
    return {"name": "tool-efficiency", "value": value}
# !snippet:end
