import typing

import inngest

inngest_client = inngest.Inngest(app_id="my-app")
functions: list[inngest.Function[typing.Any]] = []
