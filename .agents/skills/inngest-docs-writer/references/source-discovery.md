# Source Discovery

Build a source packet before writing or editing docs.

## Minimum Source Packet

- User request and desired artifact.
- Local files likely affected.
- Relevant existing docs and examples.
- Product/source code that defines the behavior.
- GitHub PRs/issues that introduced or changed the behavior.
- Linear ticket scope, owner, status, and acceptance criteria.
- Notion spec, project tracker, SEO sheet, or planning page.
- Slack thread decisions, especially from product/engineering/docs owners.
- Open questions and assumptions.

## Connector Workflow

Use available connected tools in this order when relevant:

1. **GitHub:** find implementation PRs, review comments, changed files, and current branch state.
2. **Linear:** read the ticket, comments, status, labels, project, assignee, and related issues.
3. **Notion:** fetch specs, trackers, SEO recommendations, launch notes, and project docs.
4. **Slack:** read linked threads and search owner/channel context. If files are attached, read file metadata/content when available.
5. **Local repo:** use `rg`, `rg --files`, `git log`, and existing MDX patterns.

If a connector is unavailable, state the missing source and ask for a link/export when the risk is high. Do not invent source context.

## Slack Notes

- Read full threads, not only linked replies.
- Preserve timestamps, authors, and links for decisions.
- Use `slack_read_file` or equivalent for attachments when file IDs are available.
- Treat Slack as decision context, not final product truth. Verify behavior against code or docs when possible.

## Source Weight

- **Code and merged PRs:** highest authority for current behavior.
- **Product specs and owner decisions:** authority for intended behavior.
- **Linear tickets:** authority for scope and acceptance.
- **Slack:** authority for decisions and nuance; verify if ambiguous.
- **SEO sheets/Notion recommendations:** authority for planned metadata, but check global layout behavior before applying literally.
