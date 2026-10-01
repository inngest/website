from .stubs import inngest_client, send_reminder

# !snippet:start
import datetime

import inngest


@inngest_client.create_function(
    fn_id="schedule-reminder",
    trigger=inngest.TriggerEvent(event="reminders/created"),
    cancel=[
        inngest.Cancel(
            # The event name that cancels this function
            event="tasks/reminder.deleted",
            # Ensure the cancellation event (async) and the
            # triggering event (event)'s reminderId are the same:
            if_exp="async.data.reminderId == event.data.reminderId",
            # only in the first 24h since the function was scheduled.
            # this is optional.
            timeout=datetime.timedelta(hours=24),
        ),
    ],
)
async def schedule_reminder(ctx: inngest.Context) -> None:
    remind_at = datetime.datetime.fromisoformat(
        str(ctx.event.data["remindAt"])
    )
    await ctx.step.sleep_until("wait-until-due", remind_at)

    async def send() -> None:
        await send_reminder(ctx.event.data)

    await ctx.step.run("send-reminder", send)


# !snippet:end
