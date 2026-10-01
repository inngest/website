import inngest

inngest_client = inngest.Inngest(app_id="my-app")

stripe_secret = "whsec_..."


def verify_sig(raw: str, sig: str, secret: str) -> bool:
    return bool(raw and sig and secret)


def welcome_email_html() -> str:
    return ""


class _Emails:
    async def send(self, *, to: str, from_: str, subject: str, html: str) -> dict[str, str]:
        return {}


emails = _Emails()
