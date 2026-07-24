# Implementation

Follow the repo's `AGENTS.md` first.

## Local Repo Rules

- Use `pnpm`, never `npm`.
- Prefer `rg` and `rg --files` for search.
- Use relative URLs for internal links.
- Use existing docs components and MDX patterns.
- Use `apply_patch` for manual edits.
- Do not revert unrelated user changes.
- Avoid broad Prettier churn; format only touched files when useful.

## Docs Files

- Documentation lives under `pages/docs/**/*.mdx`.
- Blog posts live under `content/blog`.
- Snippets live under `snippets`.
- Docs search notes live in `shared/Docs/SEARCH.md`.
- Docs layout metadata is in `shared/Docs/Layout.tsx`.

## Snippets

Use snippets when code examples should be centralized or reused.

Markers:

```ts
// !snippet:start
// !snippet:end
```

MDX reference:

````mdx
```ts
!snippet:path=snippets/path/to/file.ts
```
````

Run snippet/markdown checks when changing snippets or generated markdown.

## PR Practice

Keep docs PRs narrow:

- One behavioral/documentation goal per PR.
- Clear source links in the PR body.
- Validation commands included.
- Known follow-ups called out explicitly.
- Draft PRs when waiting on owner confirmation.
