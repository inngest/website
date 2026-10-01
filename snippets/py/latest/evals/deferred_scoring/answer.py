# !snippet:start
# Requires the inngest release after 0.5.19.
import inngest

from .client import inngest_client
from .scorer import feedback_scorer
from .stubs import write_answer


@inngest_client.create_function(
    fn_id="answer-ticket",
    trigger=inngest.TriggerEvent(event="support/ticket.created"),
)
async def answer_ticket(ctx: inngest.Context) -> str:
    message = str(ctx.event.data["message"])

    async def write() -> str:
        return await write_answer(message)

    answer = await ctx.step.run("write-answer", write)

    ctx.defer(
        "score-feedback",
        function=feedback_scorer,
        data={"ticketId": ctx.event.data["ticketId"]},
    )

    return answer
# !snippet:end
