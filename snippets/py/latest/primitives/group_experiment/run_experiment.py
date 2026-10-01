import inngest

from .stubs import answer_with_current_model, answer_with_new_model


async def fn(ctx: inngest.Context) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    from inngest.experimental import experiment

    # Python has no weighted() selector. Bucketing on the run ID gives each
    # run its own weighted assignment.
    res = await ctx.group.experiment(
        "answer-model",
        variants={
            "current": lambda: ctx.step.run(
                "answer-current", answer_with_current_model
            ),
            "new": lambda: ctx.step.run("answer-new", answer_with_new_model),
        },
        select=experiment.bucket(
            ctx.run_id, weights={"current": 90, "new": 10}
        ),
    )
    result, variant, experiment_ref = (
        res.result,
        res.variant,
        res.experiment_ref,
    )
    # !snippet:end
    print(result, variant, experiment_ref)
