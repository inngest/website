const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const v1TypeTokens = require("./utils/v1/typography.tokens.json");

/**
 * v1 typography plugin — registers `text-v1-{name}` components from the
 * generated token map. Keep in sync with utils/v1/type-spec.mjs:
 *   node scripts/generate-typography-tokens.mjs
 *
 * Trim: tokens with `trim: "cap"` apply native `text-box-trim` so the
 * visible box equals cap-height — exact at any size and valid on
 * flex/inline-flex. For browsers without `text-box-trim` (e.g. Firefox)
 * the same cap-height/baseline margins are emitted as ::before/::after
 * rules, gated behind `@supports not (...)` so they never double-trim.
 * Untrimmed tokens (the `-loose` siblings, plus byline/quote/code/etc.)
 * omit both — trim is selective (titles/labels), not applied to body.
 *
 * Uses addComponents so utilities sit at component-layer specificity
 * and are easy to override with one-off Tailwind classes downstream.
 */
// Mirrors utils/v1/breakpoints.ts — kept in sync manually because the
// Tailwind config is CommonJS and the constants module is TypeScript.
// Both reference Tailwind's default `screens` values.
const V1_BREAKPOINTS_PX = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

const v1TypographyPlugin = plugin(({ addComponents }) => {
  const components = {};
  for (const [name, t] of Object.entries(v1TypeTokens)) {
    const selector = `.text-v1-${name}`;
    components[selector] = {
      fontFamily: t.fontFamily,
      fontSize: t.fontSize,
      lineHeight: t.lineHeight,
      fontWeight: t.fontWeight,
      ...(t.letterSpacing && { letterSpacing: t.letterSpacing }),
      // Native cap-height trim — exact at any size and (unlike the
      // ::before/::after fallback below) works on flex/inline-flex.
      ...(t.trim === "cap" && {
        textBoxTrim: "trim-both",
        textBoxEdge: "cap alphabetic",
      }),
    };
    if (t.trim === "cap") {
      // Fallback for browsers without `text-box-trim` (e.g. Firefox).
      // Gated behind @supports so it never double-trims where native is
      // available. Pseudo-elements can't trim a flex container, so flex
      // text degrades to untrimmed there (native covers it elsewhere).
      const supports = "@supports not (text-box-trim: trim-both)";
      components[supports] = components[supports] || {};
      components[supports][`${selector}::before`] = {
        content: '""',
        display: "table",
        marginBottom: t.capHeightTrim,
      };
      components[supports][`${selector}::after`] = {
        content: '""',
        display: "table",
        marginTop: t.baselineTrim,
      };
    }
    // Responsive overrides — currently only `fluid` (→ fontSize) is
    // expressible in the spec; extend the prop list here if more
    // properties become responsive-aware later.
    if (t.responsive) {
      for (const [bp, override] of Object.entries(t.responsive)) {
        const px = V1_BREAKPOINTS_PX[bp];
        if (!px) continue;
        const key = `@media (min-width: ${px}px)`;
        components[key] = components[key] || {};
        components[key][selector] = {
          ...(override.fluid && { fontSize: override.fluid }),
        };
      }
    }
  }
  addComponents(components);
});

const theme2024 = {
  black: "#010101",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // For Tabs.tsx
    ...[1, 2, 3, 4, 5, 6]
      .map((i) => [`grid-cols-${i}`, `sm:grid-cols-${i}`, `w-1/${i}`])
      .flat(),
  ],
  theme: {
    typography: require("./typography"),
    extend: {
      // v1 section spacing rhythm — the single source of truth for the
      // header→body→content gaps (see docs/v1-design-system.md). The gap
      // below a header is determined by markup: 48px when body copy sits
      // between the H2 and the content, 96px when the H2 leads straight
      // into content (96 = 48 + 48, keeping H2→content constant).
      spacing: {
        "v1-stack": "48px",
        "v1-stack-lg": "96px",
      },
      colors: {
        // Legacy extensions
        slate: {
          950: "#0C1323",
          1000: "#080D19",
          1050: "#050911",
        },
        // Aliases for ease of re-design
        body: colors.slate[100],
        primary: colors.indigo["500"],
        inngestBlack: theme2024.black,
        background: theme2024.black, // TODO - Change to carbon-1000

        // Redesign 2025
        inngestLux: "rgb(var(--color-inngest-lux) / <alpha-value>)",
        inngestLuxDark: "rgb(var(--color-inngest-lux-dark) / <alpha-value>)",

        // Redesign 2024
        cta: "#CBB26A",
        ctaHover: "#AD8513",

        // Design System 2024
        carbon: {
          0: "rgb(var(--color-carbon-0) / <alpha-value>)",
          50: "rgb(var(--color-carbon-50) / <alpha-value>)",
          100: "rgb(var(--color-carbon-100) / <alpha-value>)",
          200: "rgb(var(--color-carbon-200) / <alpha-value>)",
          300: "rgb(var(--color-carbon-300) / <alpha-value>)",
          400: "rgb(var(--color-carbon-400) / <alpha-value>)",
          500: "rgb(var(--color-carbon-500) / <alpha-value>)",
          600: "rgb(var(--color-carbon-600) / <alpha-value>)",
          700: "rgb(var(--color-carbon-700) / <alpha-value>)",
          800: "rgb(var(--color-carbon-800) / <alpha-value>)",
          900: "rgb(var(--color-carbon-900) / <alpha-value>)",
          1000: "rgb(var(--color-carbon-1000) / <alpha-value>)",
        },
        matcha: {
          0: "rgb(var(--color-matcha-0) / <alpha-value>)",
          100: "rgb(var(--color-matcha-100) / <alpha-value>)",
          200: "rgb(var(--color-matcha-200) / <alpha-value>)",
          300: "rgb(var(--color-matcha-300) / <alpha-value>)",
          400: "rgb(var(--color-matcha-400) / <alpha-value>)",
          500: "rgb(var(--color-matcha-500) / <alpha-value>)",
          600: "rgb(var(--color-matcha-600) / <alpha-value>)",
          700: "rgb(var(--color-matcha-700) / <alpha-value>)",
          800: "rgb(var(--color-matcha-800) / <alpha-value>)",
          900: "rgb(var(--color-matcha-900) / <alpha-value>)",
        },
        breeze: {
          0: "rgb(var(--color-breeze-0) / <alpha-value>)",
          100: "rgb(var(--color-breeze-100) / <alpha-value>)",
          200: "rgb(var(--color-breeze-200) / <alpha-value>)",
          300: "rgb(var(--color-breeze-300) / <alpha-value>)",
          400: "rgb(var(--color-breeze-400) / <alpha-value>)",
          500: "rgb(var(--color-breeze-500) / <alpha-value>)",
          600: "rgb(var(--color-breeze-600) / <alpha-value>)",
          700: "rgb(var(--color-breeze-700) / <alpha-value>)",
          800: "rgb(var(--color-breeze-800) / <alpha-value>)",
          900: "rgb(var(--color-breeze-900) / <alpha-value>)",
        },
        ruby: {
          0: "rgb(var(--color-ruby-0) / <alpha-value>)",
          100: "rgb(var(--color-ruby-100) / <alpha-value>)",
          200: "rgb(var(--color-ruby-200) / <alpha-value>)",
          300: "rgb(var(--color-ruby-300) / <alpha-value>)",
          400: "rgb(var(--color-ruby-400) / <alpha-value>)",
          500: "rgb(var(--color-ruby-500) / <alpha-value>)",
          600: "rgb(var(--color-ruby-600) / <alpha-value>)",
          700: "rgb(var(--color-ruby-700) / <alpha-value>)",
          800: "rgb(var(--color-ruby-800) / <alpha-value>)",
          900: "rgb(var(--color-ruby-900) / <alpha-value>)",
        },
        honey: {
          0: "rgb(var(--color-honey-0) / <alpha-value>)",
          100: "rgb(var(--color-honey-100) / <alpha-value>)",
          200: "rgb(var(--color-honey-200) / <alpha-value>)",
          300: "rgb(var(--color-honey-300) / <alpha-value>)",
          400: "rgb(var(--color-honey-400) / <alpha-value>)",
          500: "rgb(var(--color-honey-500) / <alpha-value>)",
          600: "rgb(var(--color-honey-600) / <alpha-value>)",
          700: "rgb(var(--color-honey-700) / <alpha-value>)",
          800: "rgb(var(--color-honey-800) / <alpha-value>)",
          900: "rgb(var(--color-honey-900) / <alpha-value>)",
        },
        blush: {
          0: "rgb(var(--color-blush-0) / <alpha-value>)",
          100: "rgb(var(--color-blush-100) / <alpha-value>)",
          200: "rgb(var(--color-blush-200) / <alpha-value>)",
          300: "rgb(var(--color-blush-300) / <alpha-value>)",
          400: "rgb(var(--color-blush-400) / <alpha-value>)",
          500: "rgb(var(--color-blush-500) / <alpha-value>)",
          600: "rgb(var(--color-blush-600) / <alpha-value>)",
          700: "rgb(var(--color-blush-700) / <alpha-value>)",
          800: "rgb(var(--color-blush-800) / <alpha-value>)",
          900: "rgb(var(--color-blush-900) / <alpha-value>)",
        },
        purplehaze: {
          0: "rgb(var(--color-purplehaze-0) / <alpha-value>)",
          100: "rgb(var(--color-purplehaze-100) / <alpha-value>)",
          200: "rgb(var(--color-purplehaze-200) / <alpha-value>)",
          300: "rgb(var(--color-purplehaze-300) / <alpha-value>)",
          400: "rgb(var(--color-purplehaze-400) / <alpha-value>)",
          500: "rgb(var(--color-purplehaze-500) / <alpha-value>)",
          600: "rgb(var(--color-purplehaze-600) / <alpha-value>)",
          700: "rgb(var(--color-purplehaze-700) / <alpha-value>)",
          800: "rgb(var(--color-purplehaze-800) / <alpha-value>)",
          900: "rgb(var(--color-purplehaze-900) / <alpha-value>)",
        },
        primary: {
          "2xSubtle": "rgb(var(--color-primary-2xSubtle) / <alpha-value>)",
          xSubtle: "rgb(var(--color-primary-xSubtle) / <alpha-value>)",
          subtle: "rgb(var(--color-primary-subtle) / <alpha-value>)",
          moderate: "rgb(var(--color-primary-moderate) / <alpha-value>)",
          intense: "rgb(var(--color-primary-intense) / <alpha-value>)",
          xIntense: "rgb(var(--color-primary-xIntense) / <alpha-value>)",
          "2xIntense": "rgb(var(--color-primary-2xIntense) / <alpha-value>)",
        },
        secondary: {
          "4xSubtle": "rgb(var(--color-secondary-4xSubtle) / <alpha-value>)",
          "3xSubtle": "rgb(var(--color-secondary-3xSubtle) / <alpha-value>)",
          "2xSubtle": "rgb(var(--color-secondary-2xSubtle) / <alpha-value>)",
          xSubtle: "rgb(var(--color-secondary-xSubtle) / <alpha-value>)",
          subtle: "rgb(var(--color-secondary-subtle) / <alpha-value>)",
          moderate: "rgb(var(--color-secondary-moderate) / <alpha-value>)",
          intense: "rgb(var(--color-secondary-intense) / <alpha-value>)",
          xIntense: "rgb(var(--color-secondary-xIntense) / <alpha-value>)",
          "2xIntense": "rgb(var(--color-secondary-2xIntense) / <alpha-value>)",
        },
        tertiary: {
          "2xSubtle": "rgb(var(--color-tertiary-2xSubtle) / <alpha-value>)",
          xSubtle: "rgb(var(--color-tertiary-xSubtle) / <alpha-value>)",
          subtle: "rgb(var(--color-tertiary-subtle) / <alpha-value>)",
          moderate: "rgb(var(--color-tertiary-moderate) / <alpha-value>)",
          intense: "rgb(var(--color-tertiary-intense) / <alpha-value>)",
          xIntense: "rgb(var(--color-tertiary-xIntense) / <alpha-value>)",
          "2xIntense": "rgb(var(--color-tertiary-2xIntense) / <alpha-value>)",
        },
        quaternary: {
          coolxSubtle:
            "rgb(var(--color-quaternary-cool-xSubtle) / <alpha-value>)",
          coolModerate:
            "rgb(var(--color-quaternary-cool-moderate) / <alpha-value>)",
          coolxIntense:
            "rgb(var(--color-quaternary-cool-xIntense) / <alpha-value>)",
        },
        accent: {
          "2xSubtle": "rgb(var(--color-accent-2xSubtle) / <alpha-value>)",
          xSubtle: "rgb(var(--color-accent-xSubtle) / <alpha-value>)",
          subtle: "rgb(var(--color-accent-subtle) / <alpha-value>)",
          moderate: "rgb(var(--color-accent-moderate) / <alpha-value>)",
          intense: "rgb(var(--color-accent-intense) / <alpha-value>)",
          xIntense: "rgb(var(--color-accent-xIntense) / <alpha-value>)",
          "2xIntense": "rgb(var(--color-accent-2xIntense) / <alpha-value>)",
        },
        status: {
          failed: "rgb(var(--color-tertiary-intense) / <alpha-value>)",
          running: "rgb(var(--color-secondary-intense) / <alpha-value>)",
          runningSubtle: "rgb(var(--color-secondary-xSubtle) / <alpha-value>)",
          queued: "rgb(var(--color-quaternary-cool-xIntense) / <alpha-value>)",
          queuedSubtle:
            "rgb(var(--color-quaternary-cool-xSubtle) / <alpha-value>)",
          completed: "rgb(var(--color-primary-intense) / <alpha-value>)",
          cancelled: "rgb(var(--color-foreground-cancelled) / <alpha-value>)",
        },

        // v1 redesign — see components/v1/README.md
        // Tokens defined in styles/v1.css at :root with --color-v1-* prefixes.
        // Only semantic tokens are exposed here; primitives stay internal.
        // Multi-purpose semantics live in colors.v1.* (usable as bg/text/border).
        // Surface-only / text-only / border-only semantics are extended on
        // backgroundColor / textColor / borderColor below.
        v1: {
          // Brand foundation
          frost: "rgb(var(--color-v1-frost) / <alpha-value>)",
          jetBlack: "rgb(var(--color-v1-jet-black) / <alpha-value>)",
          steel: "rgb(var(--color-v1-steel) / <alpha-value>)",

          // Neutral ramp — white (0) → near-black (500). NB: distinct from
          // the global `carbon` scale; carbon-400 here is #212121 charcoal.
          carbon: {
            0: "rgb(var(--color-v1-carbon-0) / <alpha-value>)",
            50: "rgb(var(--color-v1-carbon-50) / <alpha-value>)",
            100: "rgb(var(--color-v1-carbon-100) / <alpha-value>)",
            200: "rgb(var(--color-v1-carbon-200) / <alpha-value>)",
            300: "rgb(var(--color-v1-carbon-300) / <alpha-value>)",
            400: "rgb(var(--color-v1-carbon-400) / <alpha-value>)",
            500: "rgb(var(--color-v1-carbon-500) / <alpha-value>)",
          },

          // Primary ramp (green) — buttons, status, success
          "primary-intense":
            "rgb(var(--color-v1-primary-intense) / <alpha-value>)",
          "primary-moderate":
            "rgb(var(--color-v1-primary-moderate) / <alpha-value>)",
          "primary-subtle":
            "rgb(var(--color-v1-primary-subtle) / <alpha-value>)",
          "primary-2xSubtle":
            "rgb(var(--color-v1-primary-2x-subtle) / <alpha-value>)",
          "primary-3xSubtle":
            "rgb(var(--color-v1-primary-3x-subtle) / <alpha-value>)",

          // Brand accents
          "accent-salmon": "rgb(var(--color-v1-salmon-200) / <alpha-value>)",
          "accent-salmon-light":
            "rgb(var(--color-v1-salmon-100) / <alpha-value>)",
          "accent-salmon-dark":
            "rgb(var(--color-v1-salmon-300) / <alpha-value>)",
          "accent-salmon-gradient":
            "rgb(var(--color-v1-salmon-gradient) / <alpha-value>)",
          "accent-blue": "rgb(var(--color-v1-blue-200) / <alpha-value>)",
          "accent-blue-gradient":
            "rgb(var(--color-v1-blue-gradient) / <alpha-value>)",
          "accent-green": "rgb(var(--color-v1-green-200) / <alpha-value>)",

          // Status
          "status-completed":
            "rgb(var(--color-v1-status-completed) / <alpha-value>)",
          "status-completed-text":
            "rgb(var(--color-v1-status-completed-text) / <alpha-value>)",

          // Codeblock
          "code-comment": "rgb(var(--color-v1-code-comment) / <alpha-value>)",
          "code-string": "rgb(var(--color-v1-code-string) / <alpha-value>)",
          "code-bracket": "rgb(var(--color-v1-code-bracket) / <alpha-value>)",
          "code-keyword": "rgb(var(--color-v1-code-keyword) / <alpha-value>)",
        },
      },
      borderColor: {
        subtle: "rgb(var(--color-border-subtle) / <alpha-value>)",
        muted: "rgb(var(--color-border-muted) / <alpha-value>)",
        contrast: "rgb(var(--color-border-contrast) / <alpha-value>)",
        disabled: "rgb(var(--color-border-disabled) / <alpha-value>)",
        success: "rgb(var(--color-border-success) / <alpha-value>)",
        error: "rgb(var(--color-border-error) / <alpha-value>)",
        warning: "rgb(var(--color-border-warning) / <alpha-value>)",
        info: "rgb(var(--color-border-info) / <alpha-value>)",

        // v1 redesign — border-only semantics (utility: border-v1-*)
        "v1-subtle": "rgb(var(--color-v1-border-subtle) / <alpha-value>)",
        "v1-muted": "rgb(var(--color-v1-border-muted) / <alpha-value>)",
        "v1-strong": "rgb(var(--color-v1-border-strong) / <alpha-value>)",
        "v1-contrast": "rgb(var(--color-v1-border-contrast) / <alpha-value>)",
        "v1-active": "rgb(var(--color-v1-border-active) / <alpha-value>)",
      },
      backgroundColor: {
        canvasBase: "rgb(var(--color-background-canvas-base) / <alpha-value>)",
        canvasSubtle:
          "rgb(var(--color-background-canvas-subtle) / <alpha-value>)",
        canvasMuted:
          "rgb(var(--color-background-canvas-muted) / <alpha-value>)",
        surfaceBase:
          "rgb(var(--color-background-surface-base) / <alpha-value>)",
        surfaceSubtle:
          "rgb(var(--color-background-surface-subtle) / <alpha-value>)",
        surfaceMuted:
          "rgb(var(--color-background-surface-muted) / <alpha-value>)",
        disabled: "rgb(var(--color-background-disabled) / <alpha-value>)",
        contrast: "rgb(var(--color-background-contrast) / <alpha-value>)",
        success: "rgb(var(--color-background-success) / <alpha-value>)",
        successContrast:
          "rgb(var(--color-background-successContrast) / <alpha-value>)",
        error: "rgb(var(--color-background-error) / <alpha-value>)",
        errorContrast:
          "rgb(var(--color-background-errorContrast) / <alpha-value>)",
        warning: "rgb(var(--color-background-warning) / <alpha-value>)",
        warningContrast:
          "rgb(var(--color-background-warningContrast) / <alpha-value>)",
        info: "rgb(var(--color-background-info) / <alpha-value>)",
        infoContrast:
          "rgb(var(--color-background-infoContrast) / <alpha-value>)",
        codeEditor: "rgb(var(--color-background-codeEditor) / <alpha-value>)",
        btnPrimary: "rgb(var(--color-background-btn-primary) / <alpha-value>)",
        btnPrimaryHover:
          "rgb(var(--color-background-btn-primaryHover) / <alpha-value>)",
        btnPrimaryPressed:
          "rgb(var(--color-background-btn-primaryPressed) / <alpha-value>)",
        btnPrimaryDisabled:
          "rgb(var(--color-background-btn-primaryDisabled) / <alpha-value>)",
        btnDanger: "rgb(var(--color-background-btn-danger) / <alpha-value>)",
        btnDangerHover:
          "rgb(var(--color-background-btn-dangerHover) / <alpha-value>)",
        btnDangerPressed:
          "rgb(var(--color-background-btn-dangerPressed) / <alpha-value>)",
        btnDangerDisabled:
          "rgb(var(--color-background-btn-dangerDisabled) / <alpha-value>)",

        // v1 redesign — bg-only semantics (utility: bg-v1-*)
        "v1-canvasBase": "rgb(var(--color-v1-bg-canvas-base) / <alpha-value>)",
        "v1-canvasSubtle":
          "rgb(var(--color-v1-bg-canvas-subtle) / <alpha-value>)",
        "v1-canvasMuted":
          "rgb(var(--color-v1-bg-canvas-muted) / <alpha-value>)",
        "v1-surfaceBase":
          "rgb(var(--color-v1-bg-surface-base) / <alpha-value>)",
        "v1-surfaceElevated":
          "rgb(var(--color-v1-bg-surface-elevated) / <alpha-value>)",
        "v1-surfaceOverlay":
          "rgb(var(--color-v1-bg-surface-overlay) / <alpha-value>)",
        "v1-surfaceMuted":
          "rgb(var(--color-v1-bg-surface-muted) / <alpha-value>)",
        "v1-codeEditor": "rgb(var(--color-v1-bg-code-editor) / <alpha-value>)",
        "v1-btnPrimary": "rgb(var(--color-v1-btn-primary-bg) / <alpha-value>)",
      },
      backgroundImage: {
        // Figma token: Background-Gradient-Charcoal — charcoal diagonal
        // fade used on inner surface cards (ScaleInstantly, etc.).
        "v1-gradient-charcoal":
          "linear-gradient(295deg, rgba(2, 2, 2, 0.00) 1.46%, #212121 50.43%)",
        // Figma token: Background-Gradient-Black — darker counterpart
        // used on frames sitting against lighter section backgrounds.
        "v1-gradient-black":
          "linear-gradient(297deg, rgba(33, 33, 33, 0.00) -2.25%, #020202 46.83%)",
        // Figma token (Observability AILoops outer card 2:48295): charcoal
        // fade running horizontally — dark on the right, transparent on the
        // left. Used when content sits next to a side-by-side diagram and
        // the diagonal default would land the dark band in the wrong place.
        "v1-gradient-charcoal-horizontal":
          "linear-gradient(270deg, #212121 18.62%, rgba(2, 2, 2, 0) 100%)",
        // Figma token (Observability AILoops inner card 2:48297): black fade
        // running horizontally — dark on the right, transparent on the left.
        "v1-gradient-black-horizontal":
          "linear-gradient(270deg, #020202 18.145%, rgba(33, 33, 33, 0) 100%)",
      },
      textColor: {
        basis: "rgb(var(--color-foreground-base) / <alpha-value>)",
        subtle: "rgb(var(--color-foreground-subtle) / <alpha-value>)",
        muted: "rgb(var(--color-foreground-muted) / <alpha-value>)",
        onContrast: "rgb(var(--color-foreground-onContrast) / <alpha-value>)",
        alwaysWhite: "rgb(var(--color-foreground-alwaysWhite) / <alpha-value>)",
        alwaysBlack: "rgb(var(--color-foreground-alwaysBlack) / <alpha-value>)",
        disabled: "rgb(var(--color-foreground-disabled) / <alpha-value>)",
        link: "rgb(var(--color-foreground-link) / <alpha-value>)",
        success: "rgb(var(--color-foreground-success) / <alpha-value>)",
        error: "rgb(var(--color-foreground-error) / <alpha-value>)",
        warning: "rgb(var(--color-foreground-warning) / <alpha-value>)",
        info: "rgb(var(--color-foreground-info) / <alpha-value>)",
        btnPrimary: "rgb(var(--color-foreground-btn-primary) / <alpha-value>)",
        btnPrimaryDisabled:
          "rgb(var(--color-foreground-btn-primaryDisabled) / <alpha-value>)",
        btnDanger: "rgb(var(--color-foreground-btn-danger) / <alpha-value>)",
        btnDangerDisabled:
          "rgb(var(--color-foreground-btn-dangerDisabled) / <alpha-value>)",
        codeDelimiterBracketJson:
          "rgb(var(--color-foreground-code-delimiterBracketJson) / <alpha-value>)",
        codeStringKeyJson:
          "rgb(var(--color-foreground-code-stringKeyJson) / <alpha-value>)",
        codeNumberJson:
          "rgb(var(--color-foreground-code-numberJson) / <alpha-value>)",
        codeStringValueJson:
          "rgb(var(--color-foreground-code-stringValueJson) / <alpha-value>)",
        codeKeywordJson:
          "rgb(var(--color-foreground-code-keywordJson) / <alpha-value>)",
        codeComment:
          "rgb(var(--color-foreground-code-comment) / <alpha-value>)",
        codeString: "rgb(var(--color-foreground-code-string) / <alpha-value>)",
        codeKeyword:
          "rgb(var(--color-foreground-code-keyword) / <alpha-value>)",
        codeEntityNameFunction:
          "rgb(var(--color-foreground-code-entityNameFunction) / <alpha-value>)",

        // v1 redesign — text-only semantics (utility: text-v1-*)
        "v1-basis": "rgb(var(--color-v1-text-basis) / <alpha-value>)",
        "v1-subtle": "rgb(var(--color-v1-text-subtle) / <alpha-value>)",
        "v1-muted": "rgb(var(--color-v1-text-muted) / <alpha-value>)",
        "v1-light": "rgb(var(--color-v1-text-light) / <alpha-value>)",
        "v1-alwaysWhite":
          "rgb(var(--color-v1-text-always-white) / <alpha-value>)",
        "v1-btnPrimary":
          "rgb(var(--color-v1-btn-primary-text) / <alpha-value>)",
      },
      textDecorationColor: {
        link: "rgb(var(--color-foreground-link) / <alpha-value>)",
      },
      fontSize: {
        "5xl": ["3rem", "1.3"],
        "2xs": "0.625rem",
      },
      maxWidth: {
        "container-desktop": "1600px",
        lg: "33rem",
        "2xl": "40rem",
        "3xl": "50rem",
        "5xl": "66rem",
      },
      opacity: {
        1: "0.01",
        2.5: "0.025",
        7.5: "0.075",
        15: "0.15",
      },
      // v1 easing curves — referenced as `ease-v1-in` / `ease-v1-out`.
      // Additive: doesn't override any existing easings, so the
      // legacy site is unaffected.
      transitionTimingFunction: {
        "v1-in": "cubic-bezier(0.22, 0.61, 0.27, 1)",
        "v1-out": "cubic-bezier(0.2, 0.8, 0.2, 1)",
        // Premium card-lift easing — out-expo, long deceleration tail.
        "v1-lift": "cubic-bezier(0.16, 1, 0.3, 1)",
        // Elastic overshoot — y > 1 control point gives a bouncy
        // settle past the target. Used by the Button hover-grow.
        "v1-overshoot": "cubic-bezier(0.34, 1.46, 0.45, 1)",
        // Paint-collapse / wipe curve — matches `EASE_V1_WIPE`
        // (utils/v1/easings.ts) so the Button text-slide reads in
        // the same physical grammar as BlackReveal / TestimonialsCarousel.
        "v1-wipe": "cubic-bezier(0.7, 0, 0.15, 1)",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        // v1 logo strip carousel — translate by -50% across the duplicated track
        // for a seamless infinite loop.
        "v1-logo-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // v1 header mega-menu entrance — fade + short rise.
        "v1-nav-pop": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "v1-nav-pop": "v1-nav-pop 180ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
      },
      // v1 z-index scale. Names map intent → number so the stacking
      // order is reviewable in one place and arbitrary `z-[…]` values
      // don't have to be cross-referenced across the tree. Numeric
      // values preserve the existing stacking order — this is a rename
      // pass, not a re-layer pass.
      zIndex: {
        "v1-backdrop": "1",
        "v1-mobile-menu": "60",
        "v1-page-wipe": "100",
        "v1-cursor": "9999",
      },
    },
    fontFamily: {
      sans: 'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      heading:
        'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      mono: 'CircularXXMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      // We can use these temporary classes while we transition to the new fonts
      circular:
        'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      whyte:
        'Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      whyteInktrap:
        'Whyte Inktrap, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      whyteMono:
        'WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      whyteInktrapVariable:
        'WhyteInktrapVariable, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

      // v1 redesign — matches Figma "Font Family/Inngest-*" tokens.
      // Reuses Whyte/CircularXX faces already served by fonts-cdn.inngest.com.
      // Verified against fonts.css; "ABC Whyte" in Figma == "Whyte" on the CDN.
      v1Display:
        '"Whyte Inktrap", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      v1Heading:
        'WhyteV1, Whyte, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      v1Label:
        'WhyteMonoV1, WhyteMono, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      v1Body:
        'CircularXX, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      v1Mono:
        'CircularXXMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  plugins: [require("@tailwindcss/typography"), v1TypographyPlugin],
};
