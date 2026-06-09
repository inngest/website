# v1 Redesign

Parallel design track for the in-progress website redesign. Lives alongside the legacy design (`components/RedesignedLanding`, `components/LandingPage`, etc.) without modifying it.

## Scope

The v1 design currently owns these routes:

- `/` (homepage)
- `/ai` (AI workflows & agents)

Out-of-scope routes (docs, pricing, customers, blog, changelog, careers, about, etc.) continue to render with the legacy chrome and are not affected by this track.

## Feature flag

The v1 design is gated by `NEXT_PUBLIC_FEATURE_V1`.

- Unset (default): production renders the legacy design. v1 code is shipped but inert.
- `NEXT_PUBLIC_FEATURE_V1=true`: v1-owned routes render their v1 page; the legacy `Header` / `Footer` / `AnnouncementBanner` are skipped on those routes.

Set the flag locally in `.env.local` (gitignored) for development. Do not commit a value to checked-in env files. On Vercel, set it per-environment in the dashboard so launch and rollback are one click.

## Branching strategy

v1 work happens on the `redesign/v1` branch (and child PRs that merge into it). Vercel auto-creates preview deploys for the branch with the flag enabled — share that URL for client review. Smaller plumbing PRs can merge to `main` with the flag off; they ship safely without affecting production until the flag flips.

## Adding a new v1 route

1. Add the pathname to `V1_ROUTES` in `utils/v1/routes.ts`.
2. Add a page wrapper here under `pages/`.
3. In `app/<route>/page.tsx`, switch on `isV1Enabled()` and render the v1 page when true.

## Rules

- v1 components must not import from `RedesignedLanding`, `RedesignedPricing`, `LandingPage`, `Nav`, or any other legacy component directory. Copy and modify if a primitive is needed.
- v1 styles live in `styles/v1.css` and are imported only from v1 page entry points (never from `app/globals.css`).
- All v1 imports use the `@/components/v1/*` alias for consistency.

## Design tokens

Source: Figma design system. Tokens are declared as CSS variables at `:root` in `styles/v1.css` with `--color-v1-*` prefixes, and surfaced as Tailwind utilities in `tailwind.config.js`.

### Colors

Only **semantic** tokens are exposed in Tailwind. Primitive ramps (Carbon, Salmon, Blue, Green, Slate) are kept internal — components should reference semantic tokens, not primitives.

| Group            | Utility                                                                                                                                          | Notes                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Text             | `text-v1-basis`, `text-v1-subtle`, `text-v1-muted`, `text-v1-light`, `text-v1-alwaysWhite`, `text-v1-btnPrimary`                                 | Foreground colors             |
| Background       | `bg-v1-canvasBase`, `bg-v1-canvasSubtle`, `bg-v1-canvasMuted`, `bg-v1-surfaceBase`, `bg-v1-surfaceMuted`, `bg-v1-codeEditor`, `bg-v1-btnPrimary` | Surfaces                      |
| Border           | `border-v1-subtle`, `border-v1-muted`, `border-v1-contrast`, `border-v1-active`                                                                  | Strokes                       |
| Primary ramp     | `*-v1-primary-{intense,moderate,subtle,2xSubtle,3xSubtle}`                                                                                       | Buttons, success states       |
| Brand foundation | `*-v1-{frost,jetBlack,steel}`                                                                                                                    | Pure white / black / mid gray |
| Accents          | `*-v1-accent-{salmon,salmon-light,salmon-gradient,blue,blue-gradient,green}`                                                                     | Decorative highlights         |
| Status           | `*-v1-status-{completed,completed-text}`                                                                                                         |                               |
| Code             | `*-v1-code-{comment,string,bracket,keyword}`                                                                                                     | Codeblock syntax              |

`*` = `bg`, `text`, or `border` depending on the use site.

### Typography

Bundled text styles are Tailwind utilities registered by the v1 typography plugin in `tailwind.config.js`. Apply a single class:

```tsx
<h1 className="text-v1-display-lg">UNBREAKABLE AI.</h1>
<h2 className="text-v1-heading-lg">…</h2>
<p className="text-v1-body-lg">…</p>
<span className="text-v1-label-md">…</span>
```

Available styles: `text-v1-display-{lg,sm,xs}`, `text-v1-heading-{lg,sm,xs}`, `text-v1-heading-card`, `text-v1-body-{lg,sm}`, `text-v1-label-{md,sm}`, `text-v1-caption`, `text-v1-quote`, `text-v1-byline`, `text-v1-code`. For flowing copy where the design wants the natural line-box leading visible, use the `-loose` siblings: `text-v1-heading-{xs,sm}-loose`, `text-v1-body-{lg,sm}-loose`.

Because they're Tailwind utilities, responsive and state variants compose normally:

```tsx
<h1 className="text-v1-display-xs xl:text-v1-display-lg">…</h1>
```

**Why generated:** each token's size, line-height, and cap-height/baseline trim margins are computed by Capsize from the font's actual OpenType metrics so the visible text box matches Figma's "Vertical trim: Cap height" pixel-for-pixel. Trimmed tokens emit `::before`/`::after` margin rules; `-loose` and other untrimmed tokens omit them.

**To regenerate:**

```bash
# After replacing or adding a font file:
pnpm v1:font-metrics    # extracts metrics from OTFs to utils/v1/font-metrics.json

# After changing any style spec (utils/v1/type-spec.mjs) or font metric:
pnpm v1:typography      # regenerates utils/v1/typography.tokens.json
```

The font metrics JSON and generated token map are committed; the OTFs are not (licensed assets, kept outside the repo).

### Font families

If you need a font-family without size/spacing, use `font-v1Display`, `font-v1Heading`, `font-v1Body`, `font-v1Label`, `font-v1Mono`. Generally prefer the bundled `text-v1-*` typography utilities above.

## Components

### Button

`<Button>` is the v1 redesign's CTA primitive. Renders as a Next.js `<Link>` when `href` is provided, otherwise as a `<button>`.

```tsx
<Button href="/sign-up" variant="pill" size="lg">Start free</Button>
<Button href="/npm" variant="accent" size="lg">NPM</Button>
<Button href="/case-study" variant="primary" size="md">View case study</Button>
<Button href="/customers" variant="secondary" size="md">View all</Button>
<Button onClick={…} variant="primary">Submit</Button>
```

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `primary` (filled white, dark text, invisible border) / `secondary` (transparent + white border) / `accent` (filled salmon) / `pill` (filled white + visible dark border + 12px label, for nav-style CTAs) | `primary` |
| `size` | `sm` (40 px tall, 144 min-w — pill compact) / `md` (40 px tall, hug width) / `lg` (52 px tall, 154 min-w) / `xl` (TrustedInBigLeagues-specific, 20.215 px label + 12.6 px padding) | `md` |
| `href` | URL string — switches render to `<Link>` | — |

Sizing, typography, and color come from the design tokens; do not override with ad-hoc classes unless the case truly demands it.
