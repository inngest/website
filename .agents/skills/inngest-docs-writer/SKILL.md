---
name: inngest-docs-writer
description: Use when planning, writing, reviewing, or updating Inngest documentation, docs metadata, docs PRs, launch docs, tutorials, how-to guides, reference pages, migration guides, LLM/AX docs, or docs-related Linear/Notion/Slack/GitHub workflows. This skill helps agents build source-grounded docs from Notion, Slack, Linear, GitHub, and the local website repo; apply SEO and metadata rules from the June 2026 docs SEO work; choose pragmatic Diataxis-style content shapes; check agent-readable docs surfaces; and close the loop with circular links across PRs, tickets, Notion, and Slack.
---

# Inngest Docs Writer

## Prime Directive

Do not write docs from memory. Build a source packet first, then write.

Every docs change should be traceable to source material: product code, implementation PRs, Linear scope, Notion specs, Slack decisions, and existing docs patterns. If a source is unavailable, say what is missing and either ask for it or mark the claim as an assumption.

## Core Workflow

1. **Classify the work.** Identify whether the request is a new doc, doc refresh, SEO metadata pass, launch doc, migration guide, API/reference update, tutorial/how-to, troubleshooting page, or agent/LLM-facing docs work.
2. **Build the source packet.** Gather and cite context before drafting. Read [references/source-discovery.md](references/source-discovery.md) for the minimum source packet and connector workflow.
3. **Choose the content shape.** Use Diataxis as a lens, not a cage. Read [references/content-shapes.md](references/content-shapes.md) when choosing between tutorial, how-to, reference, explanation, or hybrid docs.
4. **Apply SEO metadata rules.** Read [references/seo-metadata.md](references/seo-metadata.md) before changing `metaTitle`, `description`, redirects, title suffix behavior, or search-result-facing copy.
5. **Check AX/readability.** Read [references/ax-docs.md](references/ax-docs.md) when the content affects `llms.txt`, `/docs-markdown`, code snippets, MCP/agent docs, or agent consumption.
6. **Implement in the repo.** Follow local `AGENTS.md`, existing MDX patterns, snippet conventions, and focused validation. Read [references/implementation.md](references/implementation.md) before editing files.
7. **Close the loop.** For tracked work, link GitHub, Linear, Notion, and Slack in both directions. Read [references/closeout.md](references/closeout.md) before opening or closing PRs/tickets.

For Claude Code or agents that cannot load Codex skills directly, adapt the workflow from [references/portable-agent-brief.md](references/portable-agent-brief.md).

## Source Packet

Create a short working note before drafting:

- **Objective:** user request and desired outcome.
- **Audience:** beginner, active implementer, maintainer, agent, search visitor, or mixed.
- **Primary sources:** Notion pages, Slack threads, Linear tickets, GitHub issues/PRs, source code, existing docs.
- **Decisions:** what is already decided, by whom, and where it was stated.
- **Unknowns:** questions that need owner confirmation.
- **Required links:** links that must appear in PR body, Linear ticket, Notion tracker, or Slack update.

Proceed only when the source packet is sufficient for the risk level. For low-risk copy edits, local context may be enough. For launch docs, API behavior, SEO recommendations, or customer-impacting docs, gather external source context first.

## Writing Standards

- Prefer exact implementation truth over polished guesses.
- Keep internal links relative, with `?ref=` tags when appropriate per repo guidance.
- Preserve existing docs style unless the request is explicitly a restructure.
- Make code snippets runnable or clearly scoped; use the repo snippet system when examples should be reused or validated.
- Use concise headings that match the task a reader or agent is trying to complete.
- Avoid marketing-style filler in docs. Docs should answer, orient, and unblock.
- Avoid unrelated formatting churn. Keep diffs reviewable.

## Review Checklist

Before calling the work done, verify:

- The source packet supports the claims.
- Metadata is page-specific and does not hard-code global suffixes.
- The doc shape matches the reader's task.
- Internal links are relative and useful.
- Agent-readable surfaces are not broken by MDX-only assumptions.
- The PR body explains what changed, why, sources, validation, and known follow-ups.
- Linear, Notion, GitHub, and Slack are linked when this is tracked project work.
