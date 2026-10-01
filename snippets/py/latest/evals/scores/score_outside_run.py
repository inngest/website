import inngest

inngest_client = inngest.Inngest(app_id="support")


async def on_rating(original_run_id: str) -> None:
    # !snippet:start
    # Requires the inngest release after 0.5.19.
    await inngest_client.score(
        name="customer-helpful",
        value=True,
        run_id=original_run_id,
    )
    # !snippet:end
