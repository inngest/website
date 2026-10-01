# !snippet:start
import inngest

inngest_client = inngest.Inngest(app_id="customer-sync")


@inngest_client.create_function(
    fn_id="sync-user",
    trigger=inngest.TriggerEvent(event="data-sync.start"),
    singleton=inngest.Singleton(
        key="event.data.user_id",
        mode="skip",
    ),
)
async def sync_user(ctx: inngest.Context) -> None:
    async def sync_user_data() -> None:
        ctx.logger.info(f"syncing user {ctx.event.data['user_id']}")

    await ctx.step.run("sync-user-data", sync_user_data)


# !snippet:end
