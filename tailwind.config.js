const colors = require("tailwindcss/colors");

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
    ...[1, 2, 3, 4, 5, 6].map((i) => [`grid-cols-${i}`, `w-1/${i}`]).flat(),
  ],
  theme: {
    typography: require("./typography"),
    extend: {
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

        // Redesign 2024
        cta: "#10B981",
        ctaHover: "#2fe4a8",

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
      },
      textDecorationColor: {
        link: 'rgb(var(--color-foreground-link) / <alpha-value>)',
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
    },
    fontFamily: {
      sans: 'CircularXX, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      heading:
        'CircularXX, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      mono: 'CircularXXMono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      // We can use these temporary classes while we transition to the new fonts
      circular:
        'CircularXX, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
