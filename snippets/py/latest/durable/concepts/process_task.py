from .stubs import inngest_client

# !snippet:start
import datetime

import inngest


@inngest_client.create_function(
    fn_id="process-task",
    trigger=inngest.TriggerEvent(event="app/task.created"),
)
async def process_task(ctx: inngest.Context) -> dict[str, object]:
    task_id = str(ctx.event.data["id"])

    async def handle_task() -> dict[str, object]:
        return {"processed": True, "id": task_id}

    result = await ctx.step.run("handle-task", handle_task)
    await ctx.step.sleep("pause", datetime.timedelta(seconds=1))
    return result


# !snippet:end
