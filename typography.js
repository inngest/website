module.exports = ({ theme }) => ({
  DEFAULT: {
    css: {
      "--tw-prose-body": "rgb(var(--color-foreground-base))",
      "--tw-prose-headings": "rgb(var(--color-foreground-base))",
      "--tw-prose-links": "rgb(var(--color-foreground-link))",
      "--tw-prose-links-hover": "rgb(var(--color-foreground-link))",
      "--tw-prose-links-underline": "rgb(var(--color-foreground-link))",
      "--tw-prose-counters": "rgb(--color-foreground-muted))",
      "--tw-prose-bullets": "rgb(var(--color-foreground-muted))",
      "--tw-prose-hr": "rgb(var(--color-border-subtle))",
      "--tw-prose-quotes": "rgb(var(--color-foreground-base))",
      "--tw-prose-quote-borders": `var(--color-border-subtle)`,
      "--tw-prose-captions": "rgb(var(--color-foreground-subtle))",
      "--tw-prose-code": "rgba(var(--color-foreground-base))",
      "--tw-prose-code-bg": "rgba(var(--color-background-canvas-muted))",
      "--tw-prose-code-ring": theme("colors.slate.300"),
      "--tw-prose-th-borders": "rgb(var(--color-border-subtle))",
      "--tw-prose-td-borders": "rgb(var(--color-border-muted))",

      // Base
      color: "var(--tw-prose-body)",
      fontSize: theme("fontSize.base")[0],
      lineHeight: theme("lineHeight.7"),

      // Layout
      "> *": {
        maxWidth: theme("maxWidth.2xl"),
        marginLeft: "auto",
        marginRight: "auto",
        "@screen lg": {
          maxWidth: theme("maxWidth.3xl"),
          marginLeft: `calc(50% - min(50%, ${theme("maxWidth.lg")}))`,
          marginRight: `calc(50% - min(50%, ${theme("maxWidth.lg")}))`,
        },
      },

      // Text
      p: {
        marginTop: theme("spacing.6"),
        marginBottom: theme("spacing.6"),
      },
      '[class~="lead"]': {
        fontSize: theme("fontSize.base")[0],
        ...theme("fontSize.base")[1],
      },

      // Lists
      ol: {
        listStyleType: "decimal",
        marginTop: theme("spacing.5"),
        marginBottom: theme("spacing.5"),
        paddingLeft: "1.625rem",
      },
      'ol[type="A"]': {
        listStyleType: "upper-alpha",
      },
      'ol[type="a"]': {
        listStyleType: "lower-alpha",
      },
      'ol[type="A" s]': {
        listStyleType: "upper-alpha",
      },
      'ol[type="a" s]': {
        listStyleType: "lower-alpha",
      },
      'ol[type="I"]': {
        listStyleType: "upper-roman",
      },
      'ol[type="i"]': {
        listStyleType: "lower-roman",
      },
      'ol[type="I" s]': {
        listStyleType: "upper-roman",
      },
      'ol[type="i" s]': {
        listStyleType: "lower-roman",
      },
      'ol[type="1"]': {
        listStyleType: "decimal",
      },
      ul: {
        listStyleType: "disc",
        marginTop: theme("spacing.5"),
        marginBottom: theme("spacing.5"),
        paddingLeft: "1.625rem",
      },
      li: {
        marginTop: theme("spacing.2"),
        marginBottom: theme("spacing.2"),
      },
      ":is(ol, ul) > li": {
        paddingLeft: theme("spacing[1.5]"),
      },
      "ol > li::marker": {
        fontWeight: "400",
        color: "var(--tw-prose-counters)",
      },
      "ul > li::marker": {
        color: "var(--tw-prose-bullets)",
      },
      "> ul > li p": {
        marginTop: theme("spacing.3"),
        marginBottom: theme("spacing.3"),
      },
      "> ul > li > *:first-child": {
        marginTop: theme("spacing.5"),
      },
      "> ul > li > *:last-child": {
        marginBottom: theme("spacing.5"),
      },
      "> ol > li > *:first-child": {
        marginTop: theme("spacing.5"),
      },
      "> ol > li > *:last-child": {
        marginBottom: theme("spacing.5"),
      },
      "ul ul, ul ol, ol ul, ol ol": {
        marginTop: theme("spacing.3"),
        marginBottom: theme("spacing.3"),
      },

      // Horizontal rules
      hr: {
        borderColor: "var(--tw-prose-hr)",
        borderTopWidth: 1,
        marginTop: theme("spacing.16"),
        marginBottom: theme("spacing.16"),
        maxWidth: "none",
        marginLeft: `calc(-1 * ${theme("spacing.4")})`,
        marginRight: `calc(-1 * ${theme("spacing.4")})`,
        "@screen sm": {
          marginLeft: `calc(-1 * ${theme("spacing.6")})`,
          marginRight: `calc(-1 * ${theme("spacing.6")})`,
        },
        "@screen lg": {
          marginLeft: `calc(-1 * ${theme("spacing.8")})`,
          marginRight: `calc(-1 * ${theme("spacing.8")})`,
        },
      },

      // Quotes
      blockquote: {
        fontWeight: "500",
        fontStyle: "italic",
        color: "var(--tw-prose-quotes)",
        borderLeftWidth: "0.25rem",
        borderLeftColor: "var(--tw-prose-quote-borders)",
        quotes: '"\\201C""\\201D""\\2018""\\2019"',
        marginTop: theme("spacing.8"),
        marginBottom: theme("spacing.8"),
        paddingLeft: theme("spacing.5"),
      },
      "blockquote p:first-of-type::before": {
        content: "open-quote",
      },
      "blockquote p:last-of-type::after": {
        content: "close-quote",
      },

      // Headings
      h1: {
        color: "var(--tw-prose-headings)",
        fontWeight: "700",
        fontSize: theme("fontSize.3xl")[0],
        ...theme("fontSize.3xl")[1],
        marginBottom: theme("spacing.4"),
      },
      h2: {
        color: "var(--tw-prose-headings)",
        fontWeight: "600",
        fontSize: theme("fontSize.2xl")[0],
        ...theme("fontSize.xl")[1],
        marginTop: theme("spacing.16"),
        marginBottom: theme("spacing.4"),
      },
      h3: {
        color: "var(--tw-prose-headings)",
        fontSize: theme("fontSize.lg")[0],
        ...theme("fontSize.lg")[1],
        fontWeight: "600",
        marginTop: theme("spacing.10"),
        marginBottom: theme("spacing.4"),
      },

      // Media
      "img, video, figure": {
        maxWidth: theme("maxWidth.2xl"),
        marginTop: theme("spacing.8"),
        marginBottom: theme("spacing.8"),
        "@screen lg": {
          maxWidth: theme("maxWidth.3xl"),
        },
      },
      "img, video": {
        width: "100%",
      },
      svg: {
        color: "var(--tw-prose-headings)",
      },
      "figure > *": {
        marginTop: "0",
        marginBottom: "0",
      },
      figcaption: {
        color: "var(--tw-prose-captions)",
        fontSize: theme("fontSize.sm")[0],
        ...theme("fontSize.sm")[1],
        marginTop: theme("spacing.2"),
      },

      // Tables
      table: {
        width: "100%",
        tableLayout: "auto",
        textAlign: "left",
        marginTop: theme("spacing.8"),
        marginBottom: theme("spacing.8"),
        lineHeight: theme("lineHeight.6"),
      },
      thead: {
        borderBottomWidth: "1px",
        borderBottomColor: "var(--tw-prose-th-borders)",
      },
      "thead th": {
        color: "var(--tw-prose-headings)",
        fontWeight: "600",
        verticalAlign: "bottom",
        paddingRight: theme("spacing.2"),
        paddingBottom: theme("spacing.2"),
        paddingLeft: theme("spacing.2"),
      },
      "thead th:first-child": {
        paddingLeft: "0",
      },
      "thead th:last-child": {
        paddingRight: "0",
      },
      "tbody tr": {
        borderBottomWidth: "1px",
        borderBottomColor: "var(--tw-prose-td-borders)",
      },
      "tbody tr:last-child": {
        borderBottomWidth: "0",
      },
      "tbody td": {
        verticalAlign: "baseline",
      },
      tfoot: {
        borderTopWidth: "1px",
        borderTopColor: "var(--tw-prose-th-borders)",
      },
      "tfoot td": {
        verticalAlign: "top",
      },
      ":is(tbody, tfoot) td": {
        paddingTop: theme("spacing.2"),
        paddingRight: theme("spacing.2"),
        paddingBottom: theme("spacing.2"),
        paddingLeft: theme("spacing.2"),
      },
      ":is(tbody, tfoot) td:first-child": {
        paddingLeft: "0",
      },
      ":is(tbody, tfoot) td:last-child": {
        paddingRight: "0",
      },

      // Inline elements
      a: {
        color: "rgba(var(--color-foreground-link) / 1)",
        textDecoration: "underline transparent",
        fontWeight: "500",
        transitionProperty: "color, text-decoration-color",
        transitionDuration: theme("transitionDuration.DEFAULT"),
        transitionTimingFunction: theme("transitionTimingFunction.DEFAULT"),
        "&:hover": {
          textDecorationColor: "var(--tw-prose-links-underline)",
        },
      },
      ":is(h1, h2, h3) a": {
        fontWeight: "inherit",
        color: "var(--color-foreground-base)",
      },
      strong: {
        fontWeight: "600",
      },
      ":is(a, blockquote, thead th) strong": {
        color: "inherit",
      },
      pre: {
        borderRadius: theme("borderRadius.md"),
      },
      code: {
        color: "var(--tw-prose-code)",
        borderRadius: theme("borderRadius.md"),
        paddingTop: theme("padding.1"),
        paddingRight: theme("padding[1.5]"),
        paddingBottom: theme("padding.1"),
        paddingLeft: theme("padding[1.5]"),
        backgroundColor: "var(--tw-prose-code-bg)",
        fontSize: theme("fontSize.xs"),
        fontWeight: theme("fontWeight.semibold"),
      },
      ":is(a, h1, h2, h3, blockquote, thead th) code": {
        color: "inherit",
      },
      "h2 code": {
        fontSize: theme("fontSize.base")[0],
        fontWeight: "inherit",
      },
      "h3 code": {
        fontSize: theme("fontSize.sm")[0],
        fontWeight: "inherit",
      },

      // Overrides
      ":is(h1, h2, h3) + *": {
        marginTop: "0",
      },
      "> :first-child": {
        marginTop: "0 !important",
      },
      "> :last-child": {
        marginBottom: "0 !important",
      },
      ".button:hover": {
        textDecoration: "none !important",
      },

      // Footnotes
      ".footnotes li": {
        scrollMarginTop: theme("spacing.32"),
      },
      "a[data-footnote-ref]": {
        scrollMarginTop: theme("spacing.32"),
      },

      // Landing pages
      ".header h1": {
        marginBottom: theme("spacing.8"),
        fontSize: theme("fontSize.4xl")[0],
        lineHeight: theme("lineHeight.10"),
      },
    },
  },
});
