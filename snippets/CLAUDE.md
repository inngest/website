# Snippet System

Centralized, statically-analyzed code examples for documentation.

## Syntax

### Markers in source files

**Go/TypeScript:**
```go
// !snippet:start
// code to include
// !snippet:end
```

**Python:**
```python
# !snippet:start
# code to include
# !snippet:end
```

Content between markers is extracted. Files without markers use entire content. Consecutive blank lines are collapsed.

### Markdown reference

In MDX files, reference snippets in code blocks:
````md
```go
!snippet:path=snippets/go/v0_11/debounce/basic.go
```
````

## Directory Structure

Each language has its own directory.

Within each language directory, there may be multiple version directories. This is necessary for migration docs (e.g. "migrating from v0.5 to v0.6").

## Processing

- `mdx/rehype.mjs`: `rehypeParseCodeBlocks()` replaces `!snippet:path=` references with file content
- `next.config.mjs`: Watches `snippets/` and touches referencing MDX files for hot reload

## Validation

**Go:** `cd snippets/go && make check`
- Runs `go build -o /dev/null` for each version directory

**Python:** `cd snippets/py && make lint && make type-check`
- `ruff check` for linting
- `mypy` for type checking

**TypeScript:** `cd snippets/ts && make check`
- Runs `tsc --noEmit` for type checking
- Run `make install` first to install dependencies

## CI

CI runs validation for each language.
