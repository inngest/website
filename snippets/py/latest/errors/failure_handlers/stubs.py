import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def record_sync_failure(
    failed_run_id: object, message: object
) -> None:
    pass


async def sync_catalog_from_source(data: object) -> None:
    pass
