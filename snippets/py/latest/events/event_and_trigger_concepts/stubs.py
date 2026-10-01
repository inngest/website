import typing

import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def process_order(data: typing.Mapping[str, object]) -> object:
    return data
