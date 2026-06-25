---
name: unreleased-content
description: Hide docs pages, doc sections, nav items, changelog entries, and blog posts behind a `?unreleased=<label>` URL param until a feature ships. Use when staging unreleased documentation, changelog entries, or blog posts, previewing not-yet-public content, gating nav links, or working with the `<Unreleased>` component or `unreleased` exports/frontmatter in the website repo.
---

# Unreleased content gating

Hide content on the docs site, changelog, and blog until a previewer opts in with a URL param. Nothing is hidden behind auth — it's a lightweight, crawler-safe preview gate for staging content before a feature launches.

## How it works

- Every gated thing carries a **label** (a short string, e.g. `score`, `eval`). Pick one label per feature.
- To reveal, add the label to the URL: `?unreleased=score`. Reveal several at once with a comma list: `?unreleased=score,eval`.
- Labels are merged into `sessionStorage`, so once revealed they stick for the rest of the session (you can navigate without re-adding the param).
- Gated content is **never rendered on the server** — it only appears client-side once a matching label is present. So crawlers (Algolia DocSearch, Google) don't see it.

The engine is `website/shared/Docs/Unreleased.tsx`: a client hook `useUnreleasedLabels()` (returns the active `Set<string>`), the `<Unreleased label fallback>` component, and `filterUnreleasedNav()` for nav data.

## The ways to gate

### 1. A whole docs page

Add one export to the top of the `.mdx` (next to `metaTitle`/`description`):

```mdx
export const unreleased = "score"
```

Without a matching label the page shows "Page not found"; its body, "On this page" menu, and prev/next links are all hidden, and it sends `noindex`. The docs `Layout` reads this export — **wrapping the body alone is not enough**, because the layout chrome (TOC, prev/next) is built from build-time data.

### 2. Part of a docs page

```mdx
import { Unreleased } from "src/shared/Docs/mdx";

<Unreleased label="score">

Only visible with ?unreleased=score. Leave blank lines around block content
so MDX parses it as markdown.

</Unreleased>
```

### 3. A docs nav item

Nav is data, not JSX, so add an `unreleased` field in `website/shared/Docs/navigationStructure.ts`:

```ts
{ title: "Scoring", href: "/docs/.../scoring", tag: "beta", unreleased: "score" }
```

The whole nav tree is filtered by `filterUnreleasedNav` in `Navigation.tsx` / `Header.tsx`.

### 4. A changelog entry

Add the export to the top of the entry in `website/content/changelog/<date>-<slug>.mdx`:

```mdx
export const title = "Score function runs";
export const date = "2026-06-24";
export const unreleased = "score";
```

The entry is hidden from the `/changelog` feed and excluded from the side menu; its own `/changelog/<slug>` page shows "Entry not found" and sends `noindex`. With a matching label it appears in the feed.

### 5. A blog post

Blog posts use **YAML frontmatter** (not `export const`), so add the field to the frontmatter block in `website/content/blog/<date>-<slug>.mdx`:

```mdx
---
heading: "Introducing scoring"
date: 2026-06-24
category: product-updates
unreleased: score
---
```

A gated post is excluded server-side from the `/blog` index, related-post cards, the RSS feed, `blog.txt`, and the `.md` mirror (which 404s). Its `/blog/<slug>` page shows "Post not found" and sends `noindex`. With a matching label, the post page renders. (Unlike the changelog feed, the blog index does not reveal gated cards client-side — reach a gated post by its direct URL.)

## Releasing a feature

Delete the gate — that's the entire "ship it" step:
- Page / changelog entry: remove the `export const unreleased = "…"` line.
- Section: remove the `<Unreleased>` tags.
- Nav: remove the `unreleased: "…"` field (and the `tag: "beta"` badge if you want).

## SEO & performance

- **No page-load impact.** Public pages are unchanged (no `unreleased` → no gating, no extra render). The only added code is a tiny client hook reading the URL + `sessionStorage` once.
- Gated content is **not in the visible DOM**, gated pages/entries are **`noindex`**, and they're **excluded from `sitemap.xml`** (a `transform` in `next-sitemap.config.js` drops any page whose source is `unreleased`) — so they stay fully out of search.
- **Known residual:** the gated content's data still ends up in the page's serialized payload (`__NEXT_DATA__` for docs section titles; the RSC Flight `<script>` for a changelog entry body). It is not in the rendered DOM and not in Algolia's content index, but it is present in the HTML source. This is the cost of revealing server-rendered content client-side without a hard 404.
- This is a **soft gate**: the URL still returns `200` (no middleware/404). Fine for "not yet public," not for secrets.

## Gotchas

- **Docs are Pages Router; the changelog is App Router (RSC).** `<Unreleased>` is a `"use client"` component and works as a client island in both.
- The component lives at `shared/Docs/Unreleased.tsx` even though the changelog uses it too (the path is historical — it's general-purpose).
- Whole-page/whole-entry gating uses the **`export const unreleased` page export** (docs, changelog) or the **`unreleased:` YAML frontmatter field** (blog), not the `<Unreleased>` wrapper. Use the wrapper only for a section *inside* an otherwise-public page.
- The blog has extra agent/SEO surfaces (index, related cards, RSS, `blog.txt`, `.md` mirror) that render server-side with no client param — gated posts are excluded from each of those server-side.
- A label is any string; reuse the same label across a feature's page, sections, nav item, and changelog entry so one `?unreleased=<label>` reveals all of it.
