import inngest

from .judge import Score, judge


# !snippet:start
async def score_conciseness(
    ctx: inngest.Context, prompt: str, answer: str
) -> Score:
    return await judge(
        ctx,
        "conciseness",
        f"""Grade whether the answer is concise and free of filler.

Question: {prompt}
Answer: {answer}

Reply with ONLY {{"score": <0-1>, "reason": "<one sentence>"}},
where 1 = maximally concise while still complete and 0 = rambling or padded.""",
    )


async def score_helpfulness(
    ctx: inngest.Context, prompt: str, answer: str
) -> Score:
    return await judge(
        ctx,
        "helpfulness",
        f"""Grade how well the answer addresses the user's request.

Question: {prompt}
Answer: {answer}

Reply with ONLY {{"score": <0-1>, "reason": "<one sentence>"}},
where 1 = fully and directly answers the request and 0 = ignores or misunderstands it.""",
    )
# !snippet:end
