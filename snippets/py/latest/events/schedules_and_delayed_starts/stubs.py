import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def build_report() -> dict[str, str]:
    return {}
