---
name: diataxis
description: Apply the Diataxis documentation framework to Inngest docs. Use this when authoring new content, reviewing draft PRs, or deciding whether a proposed page fits the Explanation quadrant (especially for pattern pages like "Flash sales and bursty workflows").
---

# Diataxis for Inngest

Diataxis is a documentation framework that splits user-facing writing into four modes. Every piece of documentation serves exactly one of these four needs. The first job of an author or reviewer is to identify which mode a given page belongs to, then write to that mode's standards.

This skill encodes the framework and adapts it to Inngest's style. It is intentionally opinionated about which mode a given piece of content belongs to so that PR reviews are fast and consistent.

## The four modes

| Mode | Question it answers | User state |
|------|---------------------|------------|
| **Tutorial** | "Show me how to learn this from zero." | Brand new, needs to be guided. |
| **How-to guide** | "I have a specific job to do. How?" | Knows the goal, needs a recipe. |
| **Reference** | "What does this function/field/event do?" | Knows the system, needs facts. |
| **Explanation** | "Why is this the way it is?" | Capable, wants to understand. |

The mistake every set of docs makes: mixing two modes on one page. A reference page that drifts into "and here's a real-world story." A tutorial that explains the underlying philosophy in the middle of step 3. A pattern page that turns into a how-to. Each mix-up degrades both modes.

## Pick the mode before you write

Use this decision tree on every page or draft PR:

```
Is the reader doing something for the first time, end to end?
├── Yes → TUTORIAL
└── No → Does the reader know the specific task they're trying to accomplish?
        ├── Yes → HOW-TO GUIDE
        └── No → Is the reader looking up the exact signature/parameters/events?
                ├── Yes → REFERENCE
                └── No → EXPLANATION
```

A faster heuristic in plain words:

- *Tutorial:* teaches by doing. The reader follows steps and ends up with a working thing. Quickstarts go here.
- *How-to:* gives a recipe for one specific problem. Assumes you already know the basics. "How to schedule a function on Eastern time."
- *Reference:* lists what exists. API surface, event payloads, configuration options. Skimmable, encyclopedic, complete.
- *Explanation:* discusses concepts, design rationale, and patterns. The reader leaves understanding why the system is shaped the way it is.

When in doubt, ask: *"Could this page work as a search result for a Google query starting with 'how to'?"* If yes → how-to. If the query would be "why does Inngest..." or "when should I use..." → explanation.

## Mode-by-mode standards

### Tutorial

**Goal:** A reader new to Inngest follows the page and ends with something working.

**Required elements:**

- Prerequisites stated up front (Node version, Inngest account, etc.)
- A single working example developed step by step
- Every code block is runnable on its own or in cumulative order
- A clear end state ("Now your function fires every hour and posts to Slack")
- Links to the relevant reference pages and how-to guides at the end

**Forbidden:**

- Skipping setup steps because they're "obvious"
- Branches like "if you want X, do Y, otherwise..." (these belong in how-tos)
- Long philosophical asides about why the system works this way

**Inngest examples:** the Quickstart, the Next.js guide, the platform-specific getting-started pages.

### How-to guide

**Goal:** A capable reader accomplishes one specific task quickly.

**Required elements:**

- A specific, action-oriented title ("How to send events from a serverless function")
- Stated assumptions ("You have an Inngest function already deployed")
- Steps in order, numbered or clearly delineated
- The code that does the thing, in a copy-pasteable form
- A "verify it worked" section

**Forbidden:**

- Teaching the reader Inngest from scratch in the introduction
- Multiple alternative paths with no recommendation
- "Here are all the parameters" lists (those are reference)

**Inngest examples:** "How to retry a step with custom backoff," "How to wait for an event in a workflow," "How to configure failure handlers."

### Reference

**Goal:** Authoritative, complete, accurate description of an API surface.

**Required elements:**

- Function/event/config name as the title
- Type signatures or schemas
- Every parameter or field documented (name, type, required/optional, description)
- Minimal, self-contained code example showing standard use
- Cross-links to related references and the relevant how-to / explanation pages

**Forbidden:**

- Marketing language
- Long narrative paragraphs
- Editorial opinions about when to use it (those belong in explanation)

**Inngest examples:** the `step.run` reference, the `inngest.createFunction` reference, the event payload reference.

### Explanation

**Goal:** The reader understands a concept, pattern, or design decision well enough to apply it elsewhere.

**Required elements:**

- A clear concept-shaped title ("Flash sales and bursty workflows," "Why steps?")
- The problem space described first, before the solution
- A discussion of tradeoffs, not just a recommendation
- A worked example that grounds the concepts (often one composed example near the end)
- Links out to the relevant how-to guides and references

**Forbidden:**

- Step-by-step instructions for one specific task (those are how-tos)
- Exhaustive parameter listings (those are reference)
- Tutorial-style "follow along" framing

**Inngest examples:** "Flash sales and bursty workflows," concept docs like "What are steps?", architectural overviews like "How concurrency works."

## Inngest style rules (apply to all modes)

These rules are enforced regardless of mode:

- **Voice:** direct, second person ("You configure," not "One might configure"). No filler ("simply," "just," "easily"). No marketing tone in body content.
- **Code blocks:** prefer TypeScript. Use the current SDK (v4) syntax. Triggers in the config object (`{ id, triggers }`), not legacy `event` strings.
- **Step API:** always wrap external interactions in `step.run`. When showing a function with multiple steps, name each step with a stable string ID.
- **Function names:** kebab-case in the `id` field (`weekly-digest`, not `weeklyDigest`).
- **Event names:** slash-namespaced, dot-separated specifics (`app/user.created`, `hubspot/lead.imported`).
- **Linking:** every page links to its sibling modes when relevant. A how-to links to the reference for its API and to the explanation for the concept. An explanation links to the relevant how-tos at the end.
- **Avoid:** "simply," "just," "easily," "in just a few lines," "powerful," "magic," em dashes.

## The pattern-page diagnostic

Ben's primary use of this skill is checking whether a proposed pattern page fits the Explanation quadrant. Pattern pages are *almost always* explanation, but the test is concrete.

A pattern page is Explanation when:

1. The title is a problem-shape or system-shape, not a task ("Flash sales and bursty workflows," "Long-running approval workflows," "Taking HTTP off the hot path with realtime").
2. The page opens with the problem context, not setup instructions.
3. The page discusses tradeoffs and alternatives, not a single recipe.
4. The worked example is *one composed example near the end* used to illustrate the concept, not the main path.
5. The reader leaves with a vocabulary they can apply to other problems in their own system.

A pattern page is *not* Explanation (and should be split) when:

- It walks the reader through a specific build step by step → that's a how-to that's been wedged into an explanation shape
- It lists every API used along the way → reference content has leaked in
- It has prerequisites and a "what you'll build" section → that's tutorial framing

When you find a candidate that's mixed-mode, split it. Andy Lawrence's experimentation docs were a single page until they were split into reference (DEV-298) and how-to (DEV-299) in April 2026. Lauren's "Flash sales and bursty workflows" is a clean Explanation page because the four criteria above all hold.

## Confirmed pattern candidates

Pages that fit Explanation cleanly and should be written or maintained as such:

- **Flash sales and bursty workflows** (Lauren, in flight) — concurrency, fan-out, queue depth, bursty load patterns
- **Taking HTTP off the hot path with realtime** (Linell, candidate) — when sync HTTP becomes a liability, what realtime + queues unlock, the tradeoff space
- (Add more as they surface)

Patterns that look like Explanation but might be hybrid — review carefully before writing:

- Anything titled "How to..." → that's already declaring itself as how-to
- Anything titled with a specific service name ("Using Inngest with Vercel") → usually how-to
- Anything titled "Introduction to..." → usually a tutorial introduction

## Workflow for reviewing a draft PR

1. Identify the mode the page is targeting (look at the title and the first paragraph)
2. Check the page against that mode's required elements
3. Check it against that mode's forbidden elements
4. If the page mixes modes, propose a split rather than try to fix it in place
5. Check the Inngest style rules
6. Confirm cross-links to sibling-mode pages are in place

## Common failures and the fix

| Failure | Fix |
|---------|-----|
| Tutorial that branches and explains | Pull the branches into separate how-to guides; pull the explanation into an explanation page |
| Reference that includes narrative recommendations | Move the recommendations into an explanation page; link from the reference |
| How-to that re-teaches the basics | Cut the intro; add a "prerequisites" callout with links to the relevant tutorial |
| Explanation that walks through a specific build | Either pull the build into a how-to, or keep it as one composed example at the end of the explanation |
| Page with marketing tone or vague verbs | Rewrite in direct second person; cut "simply," "just," "easily" |

## Further reading

- diataxis.fr — the canonical framework documentation
- Inngest internal: ask Pat for the docs audit when planning a new section
- Andy's experimentation split (PRs #1530, #1531) is the canonical worked example of taking a mixed-mode page and splitting it
