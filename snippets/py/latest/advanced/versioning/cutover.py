from .stubs import inngest_client, legacy_processor, modern_processor

# !snippet:start
import inngest

CUTOVER_TS = 1704067200000


@inngest_client.create_function(
    fn_id="process-upload",
    trigger=inngest.TriggerEvent(
        event="file/uploaded", expression=f"event.ts < {CUTOVER_TS}"
    ),
)
async def process_upload_v1(ctx: inngest.Context) -> None:
    async def process_file() -> None:
        await legacy_processor(ctx.event.data["fileId"])

    await ctx.step.run("process-file", process_file)


@inngest_client.create_function(
    fn_id="process-upload-v2",
    trigger=inngest.TriggerEvent(
        event="file/uploaded", expression=f"event.ts >= {CUTOVER_TS}"
    ),
)
async def process_upload_v2(ctx: inngest.Context) -> None:
    async def process_file() -> None:
        await modern_processor(ctx.event.data["fileId"])

    await ctx.step.run("process-file-v2", process_file)


# !snippet:end
