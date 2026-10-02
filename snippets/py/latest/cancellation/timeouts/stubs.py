import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def build_report(report_id: object) -> None:
    pass


class _PushService:
    async def push(self, reminder: object) -> None:
        pass


push_notification_service = _PushService()
