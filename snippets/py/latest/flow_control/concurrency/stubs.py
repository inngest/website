async def process_file(file_uri: str) -> None:
    pass


class _Bucket:
    async def fetch(self, uri: str) -> bytes:
        return b""


bucket = _Bucket()
