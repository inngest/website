# Inngest Website

Next.js documentation site with MDX content.

## Key Directories

- `snippets/` - Code examples for docs (see `snippets/CLAUDE.md`)

## Code Snippets

The snippet system provides centralized, validated code examples. See `snippets/CLAUDE.md` for full documentation.

Quick reference:
- Code file markers
  - Start snippet comment is `!snippet:start` (e.g. `// !snippet:start` in TypeScript)
  - End snippet comment is `!snippet:end` (e.g. `// !snippet:end` in TypeScript)
  - Both markers are optional.
- MDX usage: `` `!snippet:path=snippets/path/to/file.ext` `` in code blocks
- Processing: `mdx/rehype.mjs` extracts content at build time
