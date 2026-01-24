import inngest
import datetime

inngest_client = inngest.Inngest(app_id="my-app")

# !snippet:start
@inngest_client.create_function(
    fn_id="handle-webhook",
    debounce=inngest.Debounce(
        key="event.data.account_id",
        period=datetime.timedelta(minutes=5),
    ),
    trigger=inngest.TriggerEvent(event="intercom/company.updated")
)
async def handle_webhook(ctx: inngest.Context):
    # This function will only be scheduled 5 minutes after events are no longer
    # received with the same `data.account_id` field.
    #
    # `ctx.event` will be the last event in the series received.
    pass