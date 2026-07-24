# Closeout And Circular Linking

For tracked docs/SEO work, make the links circular so nobody has to search later.

## Required Links

Where applicable, link:

- GitHub PR to Linear ticket, Notion tracker/spec, source sheet, and Slack thread.
- Linear ticket to GitHub PR, Notion page, source sheet, and Slack thread.
- Notion page/tracker to GitHub PR, Linear ticket, source sheet, and Slack thread.
- Slack update to GitHub PR, Linear ticket, Notion page, and owner mentions.

## PR Body Template

```md
## Summary

- What changed.
- Why it changed.

## Context

- Linear: <ticket>
- Notion: <page>
- Slack: <thread>
- Source sheet/spec: <link>
- Related PRs: <links>

## Validation

- `<command>`
```

## Slack Update Template

```text
<owner mention> quick update:

Opened/updated <PR link> for <short purpose>.

Context:
- Linear: <ticket>
- Notion: <page>
- Slack/source thread: <thread>

Validation:
- `<command>`
```

## Merge Closeout

After merge:

- Update Linear status and add PR/merge link.
- Update Notion tracker/spec with PR and final status.
- Reply in Slack with the merged PR and any follow-up.
- Create a new ticket/PR for intentionally deferred work.
