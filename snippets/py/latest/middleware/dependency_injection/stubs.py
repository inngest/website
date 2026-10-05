class _AuditLog:
    async def create(self, *, user_id: str, action: str) -> dict[str, str]:
        return {"user_id": user_id, "action": action}


class Database:
    def __init__(self) -> None:
        self.audit_log = _AuditLog()
