from .stubs import inngest_client, process_item

# !snippet:start
import inngest
import pydantic


class ImportRequested(pydantic.BaseModel):
    itemIds: list[str]


@inngest_client.create_function(
    fn_id="import-items",
    trigger=inngest.TriggerEvent(event="app/items.import_requested"),
)
async def import_items(ctx: inngest.Context) -> None:
    data = ImportRequested.model_validate(ctx.event.data)

    for item_id in data.itemIds:
        await ctx.step.run("process-item", process_item, item_id)


# !snippet:end
