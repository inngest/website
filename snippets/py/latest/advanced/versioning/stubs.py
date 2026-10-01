import inngest

inngest_client = inngest.Inngest(app_id="my-app")


async def send_welcome_email(email: object) -> None:
    pass


class _Analytics:
    async def track(self, name: str, data: object) -> None:
        pass


class _Contacts:
    async def create(self, data: object) -> None:
        pass


class _Crm:
    contacts = _Contacts()


analytics = _Analytics()
crm = _Crm()


class User:
    profile: dict[str, object] = {}


async def calculate_risk_score_with_new_model(profile: object) -> float:
    return 0.0


async def legacy_processor(file_id: object) -> None:
    pass


async def modern_processor(file_id: object) -> None:
    pass
