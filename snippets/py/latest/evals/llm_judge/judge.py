# !snippet:start
import json
import os
import typing

import inngest
from anthropic import AsyncAnthropic

anthropic = AsyncAnthropic()
MODEL = os.environ["JUDGE_MODEL"]  # the model that grades answers


class Score(typing.TypedDict):
    name: str
    value: float


# Ask the model to grade against a rubric and reply with
# {"score": <0-1>, "reason": "..."}. Normalize to {"name", "value"}.
async def judge(ctx: inngest.Context, name: str, rubric: str) -> Score:
    async def call_judge() -> str:
        res = await anthropic.messages.create(
            model=MODEL,
            max_tokens=512,
            messages=[{"role": "user", "content": rubric}],
        )
        block = next((b for b in res.content if b.type == "text"), None)
        return str(block.text) if block is not None else "{}"

    text = await ctx.step.run(f"judge-{name}", call_judge)

    score = float(json.loads(text)["score"])
    return {"name": name, "value": score}
# !snippet:end
