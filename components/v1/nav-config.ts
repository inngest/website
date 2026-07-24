/**
 * Shared v1 header nav config — consumed by the desktop `Header`
 * (hover/focus mega-menus) and the `MobileMenu` drawer (accordion) so
 * both surfaces stay in lockstep.
 *
 * Menu shapes:
 *   - Platform   — icon list, trigger-anchored (526px)
 *   - Use Cases  — icon list + promo card (851px)
 *   - Resources  — 3 columns + promo card (full content width)
 *   - Open Source— plain link list, right-anchored (234px)
 */

import type { NavIconName } from "@/components/v1/NavIcons";

export interface NavMenuItem {
  label: string;
  href: string;
  /** Secondary line under the label (icon lists + columns). */
  description?: string;
  /** Leading 24×24 glyph (Platform / Use Cases rows). */
  icon?: NavIconName;
}

export interface NavMenuColumn {
  heading: string;
  items: NavMenuItem[];
}

export interface NavPromo {
  title: string;
  description: string;
  /** `/public` path; rendered through next/image (fill). */
  image: string;
  href?: string;
  /** Use Cases card bleeds (cover); Resources sits a logo card on white. */
  fit?: "cover" | "contain";
}

export interface NavMenu {
  /** Fixed panel width (px) for trigger-anchored menus. */
  width?: number;
  /** Span the header content box instead of anchoring to the trigger. */
  fullWidth?: boolean;
  /** Anchor edge relative to the trigger. Default "left". */
  align?: "left" | "right";
  /** Single column of items (Platform, Use Cases, Open Source). */
  items?: NavMenuItem[];
  /** Render the item titles a step smaller (e.g. the Open Source repo
   *  list, which is a dense list of long repo slugs). */
  compact?: boolean;
  /** Multi-column layout (Resources). */
  columns?: NavMenuColumn[];
  /** Promo card to the right of the items/columns. */
  promo?: NavPromo;
}

export interface NavItem {
  label: string;
  href: string;
  /** Present → renders a hover/focus mega-menu trigger (with chevron). */
  menu?: NavMenu;
  /** Show the GitHub mark + total star count before the chevron (Open Source). */
  githubStars?: boolean;
}

const PLATFORM_MENU: NavMenu = {
  // 808 = px-8 (32) + 288px text column + 56px gap + 400px promo + 32. The
  // fixed 288 column (see NavMenuPanel) + this width keep Platform and Use
  // Cases identical: columns aligned, promo flush right in both.
  width: 808,
  items: [
    {
      label: "Durable Execution",
      href: "/platform/durable-execution",
      description: "Run code reliably",
      icon: "durable-execution",
    },
    {
      label: "Queues & Flow Control",
      href: "/platform/flow-control",
      description: "Scale apps efficiently",
      icon: "queues",
    },
    {
      label: "Observability",
      href: "/platform/observability",
      description: "Troubleshoot quickly",
      icon: "observability",
    },
    {
      label: "Agent Evals",
      href: "/platform/agent-evals",
      description: "Choose the best variant",
      icon: "agent-evals",
    },
  ],
  promo: {
    title: "Observability",
    description:
      "Logs and APM tools show when your pipeline breaks, but not why or for whom.",
    image: "/assets/v1/nav/promo-observability.png",
    href: "/platform/observability",
    fit: "cover",
  },
};

const USE_CASES_MENU: NavMenu = {
  // 808 — matches PLATFORM_MENU so the two promo menus share the same
  // text-column width + flush-right promo (no dead space). Was 851, which
  // left ~43px of dead margin to the right of the fixed 400px promo.
  width: 808,
  items: [
    {
      label: "AI Workflows & Agents",
      href: "/ai",
      description: "Build AI agents with Inngest",
      icon: "ai-workflows",
    },
    {
      label: "Webhooks & Events",
      href: "/uses/webhooks",
      description: "Inngest events from any source, reliably",
      icon: "webhooks",
    },
    {
      label: "Background Jobs",
      href: "/uses/serverless-node-background-jobs",
      description: "Learn about background jobs",
      icon: "background-jobs",
    },
    {
      label: "Crons & Scheduled Jobs",
      href: "/uses/scheduled-jobs",
      description: "Learn about scheduled and recurring jobs",
      icon: "crons",
    },
  ],
  promo: {
    title: "Instantly Durable AI Code.",
    description:
      "Use functions to checkpoint and offload without extra infrastructure.",
    image: "/assets/v1/nav/promo-instantly-durable.png",
    href: "/ai",
    fit: "cover",
  },
};

const RESOURCES_MENU: NavMenu = {
  fullWidth: true,
  columns: [
    {
      heading: "Company",
      items: [
        {
          label: "About",
          href: "/about",
          description: "Learn more about Inngest",
        },
        {
          label: "Blog",
          href: "/blog",
          description: "Explore Inngest guides and docs.",
        },
        {
          label: "Event Schedule",
          href: "/events",
          description: "Stay updated on events & workshops",
        },
        {
          label: "Changelog",
          href: "/changelog",
          description: "See what’s new in Inngest",
        },
        {
          label: "Support",
          href: "https://support.inngest.com",
          description: "Get help from the Inngest team",
        },
      ],
    },
    {
      heading: "Build",
      items: [
        {
          label: "Open Source",
          href: "https://github.com/inngest",
          description: "Explore our open source projects",
        },
        {
          label: "Documentation",
          href: "/docs",
          description: "Read the Inngest documentation",
        },
      ],
    },
    {
      heading: "Compare",
      items: [
        {
          label: "Inngest vs. Temporal",
          href: "/compare-to-temporal",
          description: "See how Inngest compares",
        },
        {
          label: "Inngest vs. Traditional Queues",
          href: "/platform/flow-control",
          description: "See how Inngest compares",
        },
      ],
    },
  ],
  promo: {
    title: "AI in Production: The 2026 Benchmark Report",
    description:
      "How engineering teams are building, breaking, and scaling AI in production.",
    image: "/assets/v1/nav/promo-ai-benchmark.png",
    href: "/blog/ai-in-production-report-2026",
    fit: "contain",
  },
};

const OPEN_SOURCE_MENU: NavMenu = {
  // 264 = widest repo label (~170px @ text-v1-heading-xs) + px-8 gutters
  // (64px) + slack, so names like "inngest/inngest-py" stay on one line.
  width: 264,
  align: "right",
  compact: true,
  items: [
    { label: "inngest/inngest", href: "https://github.com/inngest/inngest" },
    { label: "inngest/inngest-js", href: "https://github.com/inngest/inngest-js" },
    { label: "inngest/inngest-py", href: "https://github.com/inngest/inngest-py" },
    { label: "inngest/inngestgo", href: "https://github.com/inngest/inngestgo" },
    { label: "inngest/inngest-kt", href: "https://github.com/inngest/inngest-kt" },
    { label: "inngest/agent-kit", href: "https://github.com/inngest/agent-kit" },
  ],
};

export const NAV_PRIMARY: NavItem[] = [
  { label: "Platform", href: "/platform/durable-execution", menu: PLATFORM_MENU },
  { label: "Use Cases", href: "/ai", menu: USE_CASES_MENU },
  { label: "Customers", href: "/customers" },
  { label: "Resources", href: "/blog", menu: RESOURCES_MENU },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
];

export const NAV_SECONDARY: NavItem[] = [
  {
    label: "Open Source",
    href: "https://github.com/inngest",
    menu: OPEN_SOURCE_MENU,
    githubStars: true,
  },
];

export const SIGN_IN_URL =
  process.env.NEXT_PUBLIC_APP_HOST ?? process.env.NEXT_PUBLIC_SIGNIN_URL ?? "#";
export const SIGN_UP_URL = process.env.NEXT_PUBLIC_SIGNUP_URL ?? "#";
