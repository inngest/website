from .db_middleware import get_db, inngest_client

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="write-audit-log",
    trigger=inngest.TriggerEvent(event="app/user.logged-in"),
)
async def write_audit_log(ctx: inngest.Context) -> dict[str, str]:
    db = get_db(ctx)

    async def create_audit_log() -> dict[str, str]:
        return await db.audit_log.create(
            user_id=str(ctx.event.data["userId"]),
            action="logged-in",
        )

    return await ctx.step.run("write-audit-log", create_audit_log)


# !snippet:end
