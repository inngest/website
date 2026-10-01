from .stubs import inngest_client

# !snippet:start
import datetime

import httpx
import inngest


@inngest_client.create_function(
    fn_id="fetch-item",
    trigger=inngest.TriggerEvent(event="store/item.requested"),
)
async def fetch_item(ctx: inngest.Context) -> inngest.JSON:
    item_id = ctx.event.data.get("itemId")
    if not item_id:
        raise inngest.NonRetriableError("itemId is required")

    async def fetch() -> inngest.JSON:
        async with httpx.AsyncClient() as http:
            response = await http.get(
                f"https://api.example.com/items/{item_id}"
            )

        if response.status_code == 404:
            raise inngest.NonRetriableError("item does not exist")
        if response.status_code == 429:
            raise inngest.RetryAfterError(
                "item API rate limit", datetime.timedelta(seconds=30)
            )
        if not response.is_success:
            raise Exception(f"item API returned {response.status_code}")

        return response.json()

    return await ctx.step.run("fetch-item", fetch)


# !snippet:end
