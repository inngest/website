# SEO Metadata

Use these rules for docs metadata and SEO-oriented docs updates.

## Title Rules

- `metaTitle` should be page-specific.
- Do not hard-code the global docs suffix in individual docs metadata.
- Do not add literal trailing suffixes such as `| Inngest Docs`, `| Docs`, or `- Inngest Documentation` to page-level `metaTitle`.
- Let the central docs layout own the global suffix.
- Before changing suffix behavior, inspect `shared/Docs/Layout.tsx` and confirm whether internal docs search needs crawler-side cleanup.

## Description Rules

- Descriptions should explain the specific page value in plain language.
- Include concrete terms readers search for, but do not keyword stuff.
- Avoid repeating the exact title in a way that wastes characters.
- Prefer action/result language: "Learn how to...", "Configure...", "Reference for...".

## Pat SEO Sweep Learnings

- Spreadsheet/Notion recommendations are source material, not always literal implementation instructions.
- If a recommendation says to append a suffix, check whether the app already appends one.
- Validate metadata against source rows when doing large sweeps.
- Keep metadata PRs narrow and easy to audit.
- If a mistake lands, prefer targeted corrective PRs over broad reverts when other SEO work has landed since.

## Validation

Use focused regex sweeps when changing metadata:

```bash
rg -n 'export const metaTitle = ".* \| (Inngest Docs|Docs)"' pages/docs --glob '*.mdx'
rg -n 'export const metaTitle = ".*(- Inngest Documentation|- Inngest Docs|\| Inngest Documentation)"' pages/docs --glob '*.mdx'
```

Run relevant local checks:

```bash
git diff --check
pnpm exec tsc --noEmit --pretty false
pnpm test:docs-markdown
```

Use the narrowest checks that cover the change. For pure MDX metadata changes, TypeScript and diff checks are often enough; for snippet/content changes, include docs markdown validation.
