import inngest

from .stubs import User, calculate_risk_score_with_new_model


async def handler(ctx: inngest.Context, user: User) -> float:
    # !snippet:start
    async def calculate() -> float:
        return await calculate_risk_score_with_new_model(user.profile)

    score = await ctx.step.run("calculate-risk-score-v2", calculate)
    # !snippet:end
    return score
