.PHONY: install
install:
	cd v0_4 && uv sync
	cd v0_5 && uv sync

.PHONY: lint
lint:
	cd v0_4 && uv run ruff check .
	cd v0_5 && uv run ruff check .

.PHONY: type-check
type-check:
	cd v0_4 && uv run mypy .
	cd v0_5 && uv run mypy .
