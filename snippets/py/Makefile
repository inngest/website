.PHONY: install
install:
	@uv sync

.PHONY: lint
lint:
	@uv run ruff check .

.PHONY: type-check
type-check:
	@uv run mypy .
