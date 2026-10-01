# !snippet:start
# Requires the inngest release after 0.5.19.
import datetime
import uuid

import fastapi
import inngest
import inngest.fast_api
import pydantic
from inngest.experimental import create_defer, experiment

inngest_client = inngest.Inngest(app_id="support-evals-example")


@create_defer(inngest_client, fn_id="score-support-feedback")
async def feedback_scorer(ctx: inngest.Context) -> None:
    ticket_id = str(ctx.event.data["ticketId"])
    feedback = await ctx.step.wait_for_event(
        "wait-for-feedback",
        event="support/feedback.received",
        timeout=datetime.timedelta(minutes=10),
        if_exp=f"async.data.ticketId == '{ticket_id}'",
    )
    if feedback is None:
        return

    # Write the score for the run that called ctx.defer(), credited to the
    # variant it passed.
    parent = ctx.parents[0]
    helpful = feedback.data.get("helpful") is True

    async def write_score() -> None:
        if parent.experiment is not None:
            await inngest_client.score_experiment(
                name="user-helpful",
                value=helpful,
                experiment=parent.experiment,
                run_id=parent.run_id,
            )

    await ctx.step.run("score", write_score)


@inngest_client.create_function(
    fn_id="answer-support-ticket",
    trigger=inngest.TriggerEvent(event="support/ticket.created"),
)
async def answer_ticket(ctx: inngest.Context) -> dict[str, str]:
    ticket_id = str(ctx.event.data["ticketId"])
    message = str(ctx.event.data["message"])

    async def answer_current() -> str:
        return "We received your request. Our team will reply soon."

    async def answer_rewrite() -> str:
        return (
            f"Thanks for writing about {message}. We'll help you resolve it."
        )

    res = await ctx.group.experiment(
        "answer-style",
        variants={
            "current": lambda: ctx.step.run("answer-current", answer_current),
            "rewrite": lambda: ctx.step.run("answer-rewrite", answer_rewrite),
        },
        # Python has no weighted selector. Bucketing on the run ID splits
        # new runs 50/50 and keeps each run's variant on retries.
        select=experiment.bucket(
            ctx.run_id, weights={"current": 50, "rewrite": 50}
        ),
    )
    answer = res.result

    async def score_length() -> None:
        await inngest_client.score(
            name="under-120-characters",
            value=len(answer) <= 120,
            run_id=ctx.run_id,
        )

    await ctx.step.run("score-response-length", score_length)

    ctx.defer(
        "score-user-feedback",
        function=feedback_scorer,
        data={"ticketId": ticket_id},
        experiment=res.experiment_ref,
    )

    return {"ticketId": ticket_id, "variant": res.variant, "answer": answer}


app = fastapi.FastAPI()
inngest.fast_api.serve(app, inngest_client, [answer_ticket, feedback_scorer])


class TicketRequest(pydantic.BaseModel):
    message: str = "I cannot sign in"


class FeedbackRequest(pydantic.BaseModel):
    ticketId: str
    helpful: bool = False


@app.post("/ticket")
async def create_ticket(body: TicketRequest) -> dict[str, str]:
    ticket_id = str(uuid.uuid4())
    await inngest_client.send(
        inngest.Event(
            name="support/ticket.created",
            data={"ticketId": ticket_id, "message": body.message},
            meta={"sessions": {"ticket_id": ticket_id}},
        )
    )
    return {"ticketId": ticket_id}


@app.post("/feedback")
async def send_feedback(body: FeedbackRequest) -> dict[str, object]:
    await inngest_client.send(
        inngest.Event(
            name="support/feedback.received",
            data={"ticketId": body.ticketId, "helpful": body.helpful},
            meta={"sessions": {"ticket_id": body.ticketId}},
        )
    )
    return {"ticketId": body.ticketId, "helpful": body.helpful}
# !snippet:end
