# Portable Agent Brief

Use this brief when adapting the skill for Claude Code or another agent system.

## Core Instruction

When writing or updating Inngest docs, do not draft from memory. First build a source packet from available project context, then write the smallest correct docs change.

## Required Workflow

1. Read repository guidance: `AGENTS.md`, `CLAUDE.md`, and relevant local docs conventions.
2. Identify the docs task type: new doc, refresh, SEO, API/reference, migration, launch, troubleshooting, or AX/LLM-facing docs.
3. Gather sources from the best available tools:
   - Local repo: `rg`, `git log`, source code, existing docs.
   - GitHub: implementation PRs, issues, reviews, changed files.
   - Linear: ticket scope, acceptance criteria, status, owner.
   - Notion: specs, trackers, SEO recommendations.
   - Slack: decision threads and owner context.
4. Write a source packet with objective, audience, sources, decisions, unknowns, and required links.
5. Choose a doc shape using Diataxis as a lens: tutorial, how-to, reference, explanation, or hybrid.
6. Apply SEO rules: page-specific metadata, no hard-coded global docs suffix, concrete descriptions, no keyword stuffing.
7. Check AX surfaces: snippets, `/docs-markdown`, `llms.txt`, and markdown conversion when relevant.
8. Implement narrowly and validate with focused commands.
9. Close the loop with circular links across GitHub, Linear, Notion, and Slack when tracked work is involved.

## Non-Negotiables

- Do not fabricate source context.
- Do not silently skip Slack/Notion/Linear/GitHub context for high-risk docs work.
- Do not hard-code global docs title suffixes in page metadata.
- Do not introduce unrelated formatting churn.
- Do not leave PRs/tickets/docs disconnected when the work is tracked.

## Useful Default Prompt

```text
Use the Inngest docs writer workflow. Build a source packet from the repo plus available GitHub, Linear, Notion, and Slack context before drafting. Then implement the smallest correct docs change and include validation plus circular links.
```
