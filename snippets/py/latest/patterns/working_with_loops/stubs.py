import dataclasses

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


@dataclasses.dataclass
class Page:
    items: list[dict[str, object]]
    next_cursor: str | None


class _Source:
    async def list_page(self, cursor: str | None) -> Page:
        return Page(items=[], next_cursor=None)


class _Store:
    async def upsert_many(self, items: list[dict[str, object]]) -> None:
        pass


source = _Source()
store = _Store()


async def process_item(item_id: object) -> None:
    pass
