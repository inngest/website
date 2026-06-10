# v1 Typography & Spacing System

Single source of truth for type and spacing on the v1 redesign pages
(`components/v1/**`). The goal is that the "same" element is built the same
way everywhere — tokens, not magic numbers.

> Status: **adopting.** Durable Execution is the reference/proof page.
> Roll out the rest page-by-page (checklist at the bottom).

---

## Rules at a glance

1. **Use tokens, never raw families.** Prefer `text-v1-*` utilities over
   `font-v1Display/Heading/Body/Label/Mono`. The raw families set only the
   typeface — they skip size, line-height, letter-spacing, and cap-trim.
2. **No magic px.** Spacing comes from the scale below; type comes from the
   token scale. If a value isn't a token, it's a bug-in-waiting.
3. **Color is separate from type.** Tokens carry size/line-height/trim only.
   Apply color per context, following the base rule below.

### Text color
- **Default / body = `basis`** (#f6f6f6) — the PageShell base (`text-v1-basis`),
  matching Figma `textColor/basis`. **Don't set it explicitly**; let it inherit.
- **Headers = `text-v1-frost`** (#ffffff, Figma `Color/Base/Frost`). Baked into
  `V1_SECTION_TITLE` and `SectionHeader`, so section titles/eyebrows get it
  automatically. Apply it explicitly to other headings/sub-headings.
- **Muted** uses opacity refs (`text-v1-frost/70`, `/55`…) — unchanged.
- ❌ Don't put `text-v1-frost` on a `<section>`/`<Section>` wrapper — it forces
  pure white onto body copy that should be `basis`.

---

## Components (preferred for new/migrated sections)

Two primitives wrap the spacing + type system so a section is mostly data.
Both live in `components/v1/sections/shared/`.

### `<Section>`
The section box: vertical padding on the `<section>`, gutters + width on an
inner container. Forwards refs and `<section>` props (`aria-labelledby`…).

```tsx
<Section aria-labelledby="x-heading">…</Section>          // contained 1440 (default)
<Section width="full">…</Section>                          // full-bleed width
<Section className="bg-v1-jetBlack">…</Section>            // edge-to-edge bg, contained content
<Section containerClassName="flex flex-col gap-v1-stack">… // inner layout
<Section containerClassName="!max-w-[1100px]">…            // override the 1440 (rare 1100/1280)
```
Widths in the wild: `1440` (default, 74×), full-bleed, and rare `1100/1280`
via the `!`-override. Bespoke skeletons (e.g. the stipple-CTA's centered
flex + watermark) keep their own markup.

### `<SectionHeader>`
The header lockup with the rhythm baked in — `eyebrow → title` 24, `title →
body/actions` 48, `body → actions` 32 (override via `actionsGapClassName`):

```tsx
<SectionHeader
  id="x-heading"            // wire to the Section's aria-labelledby
  eyebrow="The problem"
  title={<>Your pipelines will fail.</>}
  body="The best queues…"
  bodyClassName="max-w-[655px]"
  actions={<ButtonLink…/>}    // below the body…
  // …or titleAside={<ButtonLink…/>} for a CTA beside the title
/>
```
Reveal animations match the standard cadence. The **header → content** gap
(48 with a body, 96 without) is applied where header + content are siblings
— `gap-v1-stack` on the Section's container, or `mt-v1-stack[-lg]` on the
content. Use `titleClassName` (e.g. `text-v1-display-md`) for a different
title size.

*Reference implementation: `QueuesFlowControl/ProblemsGrid.tsx`.*

---

## 1. Typography

The scale is generated from `utils/v1/type-spec.mjs` →
`utils/v1/typography.tokens.json` → `text-v1-*` utilities (see
`tailwind.config.js`). Re-run `node scripts/generate-typography-tokens.mjs`
after editing the spec.

| Role | Use |
|---|---|
| Section title (H2) | `V1_SECTION_TITLE` (`components/v1/sections/shared/sectionTitle.ts`) — cap-trimmed Display/Sm + responsive clamp |
| Eyebrow / kicker | `text-v1-eyebrow` + `uppercase` + color |
| Sub-headings | `text-v1-heading-card` (32) · `text-v1-heading-sm` (26) · `text-v1-heading-xs` (20) · `text-v1-heading-md-cap` |
| Body copy | `text-v1-body-lg` (18) · `text-v1-body-md` · `text-v1-body-sm`; `-loose` variants where the leading must stay visible |
| Labels | `text-v1-label-md` (16) · `text-v1-label-sm` (12) |
| Caption | `text-v1-caption` |

**Cap-trim — one decision tree (never hand-write `[text-box-trim]`):**
1. A `text-v1-*` token fits → use it (trim is baked in, with a Firefox
   `@supports` fallback).
2. Bespoke-sized **block** title with no matching token → `.v1-cap-trim`.
3. Trimmed text inside a **flex** container → `.v1-trim` (native-only;
   Firefox degrades to untrimmed — fine for fixed-height labels).

### Figma ↔ code mapping
The Figma file is the source of truth (named styles on a `FontSize-N` scale).
Code tokens mirror it:

| Figma style | px / lh | Code token |
|---|---|---|
| Display/Lg | 100 / 80 | `display-lg` |
| Display/Md | 80 / 1.25 | `display-md` |
| Display/Sm | 64 / 1.25 | `display-sm` (via `V1_SECTION_TITLE`) |
| Heading/Lg | 58 / 70 | `heading-lg` |
| Heading/Md | 32 / 40 | `heading-card` *(see reconcile)* |
| Heading/Sm | 26 / 1.2 | `heading-sm` |
| Heading/Xs | 20 / 1.5 | `heading-xs` |
| Label/Md | 16 / 16 | `label-md` (= `v1-eyebrow`) |
| Label/Sm | 12 / 1.25 | `label-sm` |
| Body/Lg | 18 / 1.5 | `body-lg` |
| Body/Small | 16 / 24 | `body-sm` |
| Caption | 12 / 12.757 | `caption` |
| Code Block/Md | 16 / 1.5 | `code` *(see reconcile)* |

**Known reconcile items** (value mismatches — fix during page migration,
with visual review, not blindly):
- `code` is `14.378px` in code vs Figma `16 / 1.5`. Snap to 16/1.5.
- Three 32px heading tokens exist (`heading-card` 32/40, `heading-md-cap`
  32/40, `heading-md` 32/48). Only 32/40 matches Figma Heading/Md;
  `heading-md` (32/48) is an orphan → consolidate.
- `v1-eyebrow` duplicates `label-md` (both Figma Label/Md). Kept as a
  semantic alias; collapse if the duplication isn't worth it.

---

## 2. Spacing

### Section header rhythm (`H2 + body + content`)
The gap below a header is **determined by markup**, so it's never a judgment
call:

- **H2 → body or buttons = 48px** → `gap-v1-stack` / `mt-v1-stack`
- **body → content = 48px** → `gap-v1-stack` / `mt-v1-stack`
- **H2 → content (no body between) = 96px desktop, 48px mobile** →
  **`V1_HEADER_CONTENT_MT`** (`mt-v1-stack lg:mt-v1-stack-lg`, in
  `sectionShell.ts`) when applied as a top margin on the content block

`96 = 48 + 48`, so the H2→content distance is constant whether or not a body
is present. **Default is 48; 96 only when there is no body copy.** The 96
case is **halved to 48 on mobile** (via `V1_HEADER_CONTENT_MT`) so the title
doesn't float far above its content on small screens.

Not governed by the three rules:
- **eyebrow → H2 = 24px** (`gap-6`, Spacing-6) — standardized from the
  off-scale 22px once it was confirmed other pages use 24.
- **body → CTA** = **32px** (`gap-8`) for inline section CTAs (the
  `SectionHeader` default); **40px** (`gap-10`) for the standalone final CTA
  (`StippleCtaSection`), which breathes a touch more.
- card-internal and grid `gap-x/gap-y`

### Split layouts (text column beside a media/code column)
Apply the vertical rhythm **within the text column only**. The horizontal
gap between the two columns is a layout concern, left as-is.

### The spacing scale (Figma `Spacing-N`, confirmed in use)
`2 · 4 · 6 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 160` px.

**Every one of these is already a Tailwind default** — no custom primitives
needed. Use the scale utility, never an arbitrary px:

| px | Tailwind | Role (validated in Figma) |
|---|---|---|
| 16 | `4` | 2-column text↔media gap |
| 24 | `6` | button-pair / grid column gap, list internal |
| 32 | `8` | section left/right gutter |
| 48 | `12` → **`v1-stack`** | header→body / body→content rhythm |
| 64 | `16` | card inset |
| 96 | `24` → **`v1-stack-lg`** | header→content (no body); 48 on mobile via `V1_HEADER_CONTENT_MT` |
| 160 | `40` | section top/bottom padding |

`v1-stack` (48) and `v1-stack-lg` (96) are **semantic aliases** over the
scale — use them for the header-rhythm rule above so intent is explicit.

**Snap-to-nearest rule.** The Figma boards contain off-scale drift
(`35 / 44 / 70 / 72 / 99 / 110 …`) and sub-pixel noise — these are *not*
intent. When migrating, snap to the nearest scale value. A genuinely
intentional off-scale value (e.g. a page's 70px gutter) is a design-team
decision to confirm, not a code default.

### Section box (padding + gutters) → `V1_SECTION_SHELL`
Section spacing is a *responsive compound*, not a single value, so it lives
as a className recipe (`components/v1/sections/shared/sectionShell.ts`), not
a spacing token:

```
V1_SECTION_SHELL = "px-6 py-20 sm:px-9 sm:py-24 lg:px-8 lg:py-40"
                    gutters 24/36/32      vertical 80/96/160
```

```tsx
<section className={cn(V1_SECTION_SHELL, "relative mx-auto w-full max-w-[1440px] text-v1-frost")}>
```

The lg value (160) = Figma `Spacing-13`; the ramp snaps the off-scale `100`
→ `96` (`py-24`). A section that deliberately runs tighter/looser is an
explicit exception, not a new arbitrary value.

**Why a recipe, not a token:** `v1-stack` holds one number (48); section
padding changes per breakpoint *and* pairs vertical with horizontal, which
a single spacing token can't express.

---

## Governance

- New shared type style → add a **token** (type-spec) or a shared constant;
  don't inline a new recipe.
- New spacing value → add to the scale; don't reach for arbitrary `px`.
- Shared components (`StippleCtaSection`, `ProblemsGrid`,
  `CaseStudiesCarousel`) fan out to many pages — a change here is a
  cross-page change.

---

## Enforcement
`node scripts/lint-v1-tokens.mjs` flags raw `font-v1*`, hand-written
`[text-box-trim]`, arbitrary type sizes, and arbitrary spacing px that
duplicate a scale value. Runs as a report (warnings) today; ratchet to
`--strict` (CI-failing) per directory as pages migrate. Run `pnpm v1:lint`.

## Migrating a page

The repeatable recipe — every page is migrated the same way (Durable
Execution is the reference). Work **section by section**:

1. **Box** — wrap each `<section>` in `<Section>`. Drop the arbitrary
   `px-6 py-[…]`; pass the inner grid/flex via `containerClassName`,
   background/position via `className`, and `width="full"` for full-bleed.
2. **Header** — use `<SectionHeader>` for the title+body lockup (`eyebrow`
   / `body` / `actions`, or `titleAside` for a CTA beside the title). Keep
   a custom header **only** where the layout genuinely differs.
3. **Spacing** — `gap-v1-stack` (48) below a header, `gap-v1-stack-lg` (96)
   when the H2 leads straight into content; snap everything else to scale
   utilities (`gap-4/6/8/10/16…`). No arbitrary spacing `px`.
4. **Color** — strip blanket `text-v1-frost` from section wrappers (body
   inherits `basis`); headers carry frost via the token/component.
5. **Type** — replace raw `font-v1*`, arbitrary `text-[Npx]`, and junk
   values (`17.975px`) with `text-v1-*` tokens.
6. **CTA gaps** — inline body→CTA **32**, standalone CTA **40**,
   eyebrow→title **24**.
7. **Verify** — `pnpm v1:lint components/v1/sections/<Page> --strict`
   (zero violations; *advisories* are a per-value design call), then
   `npx tsc --noEmit`, then eyeball **desktop and mobile**.
8. **Commit per page.** Call out shared-component edits — they fan out
   (`StippleCtaSection`, `ProblemsGrid`, `CaseStudiesCarousel`).

**Leave bespoke:** heroes, genuinely different layouts, and code-syntax /
fixed-UI values (mono `text-[12px]`, etc.). The lint floor is non-zero by
design — don't force tokens where they don't belong.

## Status

**Foundation** — done
- [x] Spacing tokens (`v1-stack`, `v1-stack-lg`) + `V1_SECTION_SHELL`
- [x] `display-md` (80) token; Figma↔code mapping
- [x] `<Section>` + `<SectionHeader>` (with `titleAside`)
- [x] Lint script (`v1:lint`) + this spec
- [ ] Reconcile `code` (14.378→16/1.5) and the 32px heading trio *(needs review)*

**Pages**

| Page | Status |
|---|---|
| Durable Execution | ✅ migrated — **reference** |
| Queues & Flow Control | 🟡 partial (ProblemsGrid + token adoption; components TBD) |
| Observability | ⬜ |
| Background Jobs | ⬜ |
| Scheduled Jobs | ⬜ |
| Compare / Temporal | ⬜ |
| Pricing | ⬜ |
| Customers | ⬜ |

**Cross-cutting (after the page sweeps)**
- [ ] Heading-scale adoption (kill hand-rolled `font-v1Heading` sizes)
- [ ] Body-scale adoption (kill `17.975px` / `18.486px`)
- [ ] Strip residual blanket `text-v1-frost` (~360 site-wide)
- [ ] Capture hero + footer spacing (not in the audit)

**Later**
- [ ] Wire `v1:lint --strict` into CI / pre-commit
- [ ] Figma → code token generation (Tokens Studio / W3C DTCG)
