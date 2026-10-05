from .stubs import inngest_client, source, store

# !snippet:start
import inngest


@inngest_client.create_function(
    fn_id="import-pages",
    trigger=inngest.TriggerEvent(event="app/pages.import_requested"),
)
async def import_pages(ctx: inngest.Context) -> None:
    async def import_page(cursor: str | None) -> str | None:
        page = await source.list_page(cursor=cursor)
        await store.upsert_many(page.items)
        return page.next_cursor

    cursor: str | None = None
    while True:
        cursor = await ctx.step.run("import-page", import_page, cursor)
        if cursor is None:
            break


# !snippet:end
