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
  // navigation dynamic nested groups support
  safelist: ["ml-4", "ml-8"],
  theme: {
    typography: require("./typography"),
    extend: {
      colors: {
        // Aliases for ease of re-design
        body: colors.slate[100],
        // compat of different primary color for website and docs
        primary: "var(--primary-color)",
        inngestBlack: theme2024.black,
        // Design System 2024
        carbon: {
          0: "#fefefe",
          50: "#f6f6f6",
          100: "#e2e2e2",
          200: "#cccccc",
          300: "#b0b0b0",
          400: "#9b9b9b",
          500: "#7c7c7c",
          600: "#636363",
          700: "#4b4b4b",
          800: "#353535",
          900: "#242424",
          950: "#121212",
          1000: "#020202",
        },
        matcha: {
          0: "#eff9f2",
          100: "#dff5e6",
          200: "#c4efd4",
          300: "#9adab3",
          400: "#66bd8b",
          500: "#2c9b63",
          600: "#027a48",
          700: "#016239",
          800: "#015430",
          900: "#004d2b",
        },
        breeze: {
          0: "#eff7ff",
          100: "#e0f2ff",
          200: "#c4efd4",
          300: "#9cd2ff",
          400: "#52b2fd",
          500: "#2389f1",
          600: "#1365d6",
          700: "#1450b1",
          800: "#17439b",
          900: "#134085",
          1000: "#00050B",
        },
        // Extend base tailwind colors
        slate: {
          950: "#0C1323",
          1000: "#080D19",
          1050: "#050911",
        },
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
      sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      heading: `Inter -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
