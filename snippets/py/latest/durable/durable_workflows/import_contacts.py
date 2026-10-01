import inngest

from .stubs import (
    get_normalized_column_names,
    import_contacts,
    inngest_client,
    normalize_rows,
    parse_csv,
)


# !snippet:start
@inngest_client.create_function(
    fn_id="import-contacts",
    trigger=inngest.TriggerEvent(event="contacts/csv.uploaded"),
)
# The function handler:
async def fn(ctx: inngest.Context) -> dict[str, object]:
    async def parse() -> list[dict[str, str]]:
        return await parse_csv(str(ctx.event.data["fileURI"]))

    rows = await ctx.step.run("parse-csv", parse)

    async def normalize() -> list[dict[str, str]]:
        normalized_column_mapping = get_normalized_column_names()
        return normalize_rows(rows, normalized_column_mapping)

    normalized_rows = await ctx.step.run("normalize-raw-csv", normalize)

    async def insert() -> dict[str, int]:
        return await import_contacts(normalized_rows)

    results = await ctx.step.run("input-contacts", insert)

    return {"results": results}


# !snippet:end
