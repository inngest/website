from .stubs import inngest_client, push_notification_service

# !snippet:start
import datetime

import inngest


@inngest_client.create_function(
    fn_id="schedule-reminder",
    timeouts=inngest.Timeouts(
        # If the run takes longer than 10s to start, cancel the run.
        start=datetime.timedelta(seconds=10),
    ),
    trigger=inngest.TriggerEvent(event="tasks/reminder.created"),
)
async def schedule_reminder(ctx: inngest.Context) -> None:
    async def send_reminder_push() -> None:
        await push_notification_service.push(ctx.event.data["reminder"])

    await ctx.step.run("send-reminder-push", send_reminder_push)


# !snippet:end
