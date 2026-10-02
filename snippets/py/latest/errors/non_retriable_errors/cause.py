import inngest


def parse_order_id(raw: str) -> int:
    try:
        return int(raw)
    except ValueError as error:
        # !snippet:start
        # `from error` keeps the original exception as __cause__.
        raise inngest.NonRetriableError("orderId is invalid") from error
        # !snippet:end
