# !snippet:start
import datetime

import httpx
import inngest

inngest_client = inngest.Inngest(app_id="reminders")


@inngest_client.create_function(
    fn_id="send-scheduled-reminder",
    trigger=inngest.TriggerEvent(event="app/reminder.scheduled"),
)
async def send_scheduled_reminder(ctx: inngest.Context) -> None:
    try:
        remind_at = datetime.datetime.fromisoformat(
            str(ctx.event.data["remindAt"])
        )
    except ValueError as err:
        raise ValueError("Invalid reminder time") from err

    await ctx.step.sleep_until("wait-for-reminder", remind_at)

    async def send_reminder() -> None:
        async with httpx.AsyncClient() as http:
            await http.post(
                "https://api.example.com/reminders",
                json={"reminderId": ctx.event.data["reminderId"]},
            )

    await ctx.step.run("send-reminder", send_reminder)
# !snippet:end
