import inngest
from inngest.experimental import create_defer, experiment

inngest_client = inngest.Inngest(app_id="my-app")

CURRENT_PROMPT = "You are a support agent."
CANDIDATE_PROMPT = "You are a concise support agent."


async def run_agent_loop(
    ctx: inngest.Context, *, system: str, message: str
) -> str:
    raise NotImplementedError


@create_defer(inngest_client, fn_id="feedback-scorer")
async def feedback_scorer(ctx: inngest.Context) -> None:
    pass


async def agent(ctx: inngest.Context) -> str:
    message = str(ctx.event.data["message"])
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    selected = await ctx.group.experiment(
        "system-prompt",
        variants={
            "current": lambda: run_agent_loop(
                ctx, system=CURRENT_PROMPT, message=message
            ),
            "candidate": lambda: run_agent_loop(
                ctx, system=CANDIDATE_PROMPT, message=message
            ),
        },
        select=experiment.bucket(
            str(ctx.event.data["userId"]),
            weights={"current": 90, "candidate": 10},
        ),
    )
    answer = selected.result

    ctx.defer(
        "score-feedback",
        function=feedback_scorer,
        data={"conversationId": ctx.event.data["conversationId"]},
        experiment=selected.experiment_ref,
    )
    # !snippet:end
    return answer
