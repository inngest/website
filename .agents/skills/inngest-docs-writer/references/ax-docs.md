# AX And Agent-Readable Docs

AX means Agent Experience: how well agents can discover, understand, and use the docs.

## Agent-Facing Surfaces

- `/llms.txt`: table of contents and entrypoints for LLM tools.
- `/llms-full.txt`: larger bundled context.
- `/docs-markdown/...`: markdown version of individual docs pages.
- `pages/api/docs/chat.ts`: helper for sending page content to chat providers.
- Snippets in `snippets/`: source-backed code examples used in MDX.

## Writing For Agents

- Use stable, descriptive headings.
- Put prerequisites before steps.
- Keep code blocks complete enough to copy or adapt.
- Avoid relying on visual-only explanation.
- Prefer explicit names over "this" or "that" when referring to APIs.
- Link to canonical reference pages.
- Keep MDX components from hiding critical text from markdown conversion.

## Verification

When docs affect agent consumption:

```bash
pnpm test:docs-markdown
```

Inspect the markdown route or generated markdown for the changed page when possible:

```text
/docs-markdown/<docs-path>
```

Check that important context survives conversion from MDX to markdown.

## Algolia vs AX

Algolia powers human docs search. It is not the primary AX path.

The crawler indexes rendered docs pages and feeds the search modal. Agent-readable docs should primarily rely on markdown surfaces and source-backed snippets, not Algolia search records.
