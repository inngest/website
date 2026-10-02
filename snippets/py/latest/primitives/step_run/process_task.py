from .stubs import load_task, process_task_record

# !snippet:start
import inngest

from .client import inngest_client


@inngest_client.create_function(
    fn_id="process-task",
    trigger=inngest.TriggerEvent(event="app/task.created"),
)
async def process_task(ctx: inngest.Context) -> dict[str, bool]:
    task = await ctx.step.run(
        "load-task", load_task, ctx.event.data["taskId"]
    )

    return await ctx.step.run("process-task", process_task_record, task)
# !snippet:end
