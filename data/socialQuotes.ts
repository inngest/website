/**
 * Third-party social proof (X, LinkedIn, Reddit) used across marketing
 * pages and the /community index. Rendered as crawlable HTML — never as
 * embed widgets.
 */

export type SocialQuoteSource = "x" | "linkedin" | "reddit";

export interface SocialQuote {
  id: string;
  quote: string;
  authorName: string;
  authorTitle?: string;
  /** ISO8601 date (YYYY-MM-DD) */
  date: string;
  sourceUrl: string;
  source: SocialQuoteSource;
  /** Short label for filters and page placement (e.g. "bullmq", "temporal"). */
  tags: string[];
  /** Optional pill above the quote (e.g. "Switched from BullMQ"). */
  context?: string;
  /** Optional link text (default: platform name + date). */
  sourceLabel?: string;
  /** Profile image URL (X/LinkedIn avatar). Rendered on featured cards. */
  authorAvatar?: string;
  /** Optional date used only for /community listing order. */
  sortDate?: string;
}

export const SOCIAL_QUOTES: SocialQuote[] = [
  {
    id: "rupesh-bullmq",
    quote:
      "Almost used BullMQ because that's what everyone uses. Tried Inngest for the message queue instead. Zero broker setup, just functions that trigger when they should. Honestly the best infra decision I've made in months.",
    authorName: "Rupesh Shandilya",
    authorTitle: "Developer",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1655578149411749888/hvYl06iR_200x200.jpg",
    date: "2026-08-06",
    sourceUrl: "https://x.com/rupeshkshandily/status/2089283590571852192",
    source: "x",
    tags: ["bullmq", "queues", "background-jobs", "community"],
    context: "Switched from BullMQ",
  },
  {
    id: "marco-trigger-dev",
    quote:
      "Recently tried Inngest for background jobs with NestJS and I was impressed! I've found the APIs cleaner than Trigger.dev, and in our case we didn't want to run our jobs in a separate cloud for security issues, and Inngest allows to call HTTP endpoints on your own infra.",
    authorName: "Marco D'Alia",
    authorTitle: "Fractional CTO",
    date: "2025-05-01",
    sourceUrl:
      "https://www.linkedin.com/posts/marcodalia_recently-tried-inngest-for-background-jobs-activity-7330501109737779200-kcFx",
    source: "linkedin",
    tags: ["trigger-dev", "background-jobs", "nestjs", "community"],
    context: "Compared to Trigger.dev",
  },
  {
    id: "patrick-vercel",
    quote:
      "I was skeptical of all the durable execution frameworks popping up the last couple years — but after a few weeks using Inngest, I have to admit — I'm totally sold. It's really easy to deploy frontend apps on Vercel, but there's always been this gap for background jobs. Inngest is now filling that gap for a lot of my use cases.",
    authorName: "Patrick DeVivo",
    authorTitle: "Software Engineer & Founder",
    date: "2025-04-01",
    sourceUrl:
      "https://www.linkedin.com/posts/patrick-devivo_i-was-skeptical-of-all-the-durable-execution-activity-7320806674724786176-GWKg",
    source: "linkedin",
    tags: ["vercel", "background-jobs", "durable-execution", "community"],
    context: "Background jobs on Vercel",
  },
  {
    id: "andrew-observability",
    quote:
      "Moved complex background jobs to Inngest. Retry logic and observability are finally usable.",
    authorName: "Andrew Devs",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1897553131229339653/lIddNoig_200x200.jpg",
    date: "2026-08-02",
    sourceUrl: "https://x.com/LightningD11921/status/2083978385391566964",
    source: "x",
    tags: ["observability", "background-jobs", "community"],
    context: "Retries & observability",
  },
  {
    id: "ben-harness",
    quote:
      "If you are building a harness for non technical folks, you must understand Durable Execution. I would recommend using Inngest. Give users absolute super powers with agent led workflows.",
    authorName: "Ben Patton",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1843425653674184704/6xt3zzPB_200x200.jpg",
    date: "2026-08-06",
    sortDate: "2026-08-03",
    sourceUrl: "https://x.com/benapatton/status/2085429128732258384",
    source: "x",
    tags: ["ai", "durable-execution", "agents", "community"],
    context: "Agent harnesses",
  },
  {
    id: "claire-temporal-dx",
    quote: "Using Inngest is like a little gift to myself.",
    authorName: "Claire Vo",
    authorTitle: "Product leader",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1565475442470965248/LBMzyamM_200x200.jpg",
    date: "2026-07-30",
    sourceUrl: "https://x.com/clairevo/status/2082912221542441338",
    source: "x",
    tags: ["temporal", "dx", "community"],
    context: "Inngest vs Temporal",
    sourceLabel: "View thread on X",
  },
  {
    id: "posthog-temporal-ux",
    quote:
      "The UX/UI difference between Inngest and Temporal is night and day.",
    authorName: "yo puaaa",
    authorTitle: "PostHog",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2066653626953580544/m79bww5A_200x200.jpg",
    date: "2026-07-30",
    sourceUrl: "https://x.com/yo_puaaa/status/2082846302283428055",
    source: "x",
    tags: ["temporal", "dx", "community"],
    context: "Inngest vs Temporal",
    sourceLabel: "View thread on X",
  },
  {
    id: "omer-durability",
    quote:
      "I can't even imagine hand-rolling durability and retries. Inngest has been such a time saver. You guys are killing it.",
    authorName: "Omer Demirkan",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2008932166651289601/FY4VYNhc_200x200.jpg",
    date: "2026-07-22",
    sourceUrl: "https://x.com/umar_ibn_ansar/status/2079986105433326058",
    source: "x",
    tags: ["durable-execution", "agents", "community"],
    context: "Durability & retries",
  },
  {
    id: "tejas-rag-background",
    quote:
      "We introduced background processing using Inngest. Instead of making users wait while processing large documents, heavy tasks run asynchronously in the background. This keeps the application responsive and improves user experience.",
    authorName: "Tejas A.",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2048735544583266304/AM1x8c0P_200x200.jpg",
    date: "2026-08-05",
    sourceUrl: "https://x.com/TEJAS_DEV_code/status/2085071207586783453",
    source: "x",
    tags: ["ai", "rag", "background-jobs", "community"],
    context: "RAG document processing",
  },
  {
    id: "reddit-ai-stack",
    quote:
      "In my SaaS I'm using Next.js, Vercel, Supabase, Inngest, and Vercel AI SDK. All the agents run on Inngest triggered through webhooks on different events.",
    authorName: "Reddit user",
    authorTitle: "r/Agentic_SEO",
    date: "2026-08-01",
    sourceUrl:
      "https://www.reddit.com/r/Agentic_SEO/comments/1vf6x0x/i_changed_one_thing_in_my_seo_workflow_and_it/p1p97fy/",
    source: "reddit",
    tags: ["ai", "vercel", "agents", "community"],
    context: "Modern AI stack",
  },
  {
    id: "gautham-discovered-late",
    quote: "For me it's Inngest.",
    authorName: "Gautham Yaramasa",
    date: "2026-07-31",
    sourceUrl: "https://x.com/YaramasaGautham/status/2083164924994572633",
    source: "x",
    tags: ["community"],
    context: "Tool discovered too late",
  },
  {
    id: "supriyo-chaicode",
    quote:
      "We took ChaiBookLM to the next level by wiring up Firecrawl for scraping, Cloudinary for storage, and Inngest for seamless background workflows.",
    authorName: "Supriyo Das",
    date: "2026-08-05",
    sourceUrl: "https://x.com/SupriyoDaas/status/2085095387040547164",
    source: "x",
    tags: ["ai", "background-jobs", "community"],
    context: "GenAI cohort build",
  },
  {
    id: "skylar-temporal-dx",
    quote:
      "I've constantly felt like I'm losing my mind because there are a lot of Temporal stans and I have often felt it wasn't it DX wise. Going to try out Inngest soon.",
    authorName: "Skylar Payne",
    date: "2026-07-30",
    sourceUrl: "https://x.com/clairevo/status/2082912221542441338",
    source: "x",
    tags: ["temporal", "dx", "community"],
    context: "Inngest vs Temporal",
    sourceLabel: "View thread on X",
  },
  {
    id: "rohit-durable-agents",
    quote:
      "Step-level scoring you can defer until the real signal arrives is a smart primitive for durable agents.",
    authorName: "Rohit Kashyap",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2017834033179463682/OiQBMfKG_200x200.jpg",
    date: "2026-07-08",
    sourceUrl: "https://x.com/rohit_jsfreaky/status/2074908850747253032",
    source: "x",
    tags: ["ai", "agents", "durable-execution", "community"],
    context: "Durable agent primitives",
  },
  {
    id: "simplifai-async-cost-tracking",
    quote:
      "We use Inngest to process cost tracking events asynchronously. You send the usage data, and we crunch the numbers in the background. Zero impact on your core app's latency.",
    authorName: "SimplifAI",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2035136466226122752/YVCDXn2j_200x200.png",
    date: "2026-07-07",
    sourceUrl: "https://x.com/simplifai_tools/status/2074609929017585951",
    source: "x",
    tags: ["background-jobs", "community"],
    context: "Async cost tracking",
  },
  {
    id: "vinit-rag-observability",
    quote:
      "Used Inngest to add observability to my RAG pipeline — tracking latency, errors, and full input/output logs for every LLM call. Still learning it, but it's already made debugging the pipeline so much easier.",
    authorName: "Vinit Khapekar",
    authorTitle: "Developer",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2074501641525694464/7iQ3p6Xg_200x200.jpg",
    date: "2026-07-07",
    sourceUrl: "https://x.com/vinit_khapekar_/status/2074483718627238204",
    source: "x",
    tags: ["observability", "ai", "rag", "community"],
    context: "LLM observability",
  },
  {
    id: "manas-ai-streaming",
    quote:
      "Refactored my AI agent to run on Inngest — LLM calls now go through a background job with real-time streaming instead of blocking on HTTP. Cleaner architecture, better UX.",
    authorName: "Manas Saha",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2065355020795838464/Z8r6nU8p_200x200.jpg",
    date: "2026-07-04",
    sourceUrl: "https://x.com/ManasS8360/status/2073492766399906251",
    source: "x",
    tags: ["ai", "agents", "background-jobs", "community"],
    context: "Agent streaming",
  },
  {
    id: "ben-granular-execution",
    quote:
      "Production experiments with granular execution data via Inngest — très cool.",
    authorName: "Ben Williams",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/1851285144801247232/j7MOaDbt_200x200.jpg",
    date: "2026-06-30",
    sourceUrl: "https://x.com/theplgeek/status/2072077734633775450",
    source: "x",
    tags: ["observability", "community"],
    context: "Execution data",
  },
  {
    id: "bushcubed-just-use-inngest",
    quote: "Just use Inngest.",
    authorName: "bushcubed",
    date: "2026-06-30",
    sourceUrl: "https://x.com/bushcubed/status/2071943745877295335",
    source: "x",
    tags: ["community"],
  },
  {
    id: "alex-stack-boilerplate",
    quote:
      "The best open source and self-hostable stack: Next.js, shadcn, Drizzle, Hono, better-auth, Inngest. That's what I used to build my boilerplate.",
    authorName: "Alex Chelan",
    date: "2026-06-28",
    sourceUrl: "https://x.com/AlexChelan/status/2071196671124357502",
    source: "x",
    tags: ["ai", "vercel", "community"],
    context: "Modern SaaS stack",
  },
  {
    id: "tejas-event-driven-ai",
    quote:
      "Integrated Inngest for background jobs. First event: feature.request.created. This single event triggers the entire AI pipeline — decouples the API from AI execution completely. Retry support built in. No lost jobs.",
    authorName: "Tejas A.",
    authorAvatar:
      "https://pbs.twimg.com/profile_images/2048735544583266304/AM1x8c0P_200x200.jpg",
    date: "2026-06-27",
    sourceUrl: "https://x.com/TEJAS_DEV_code/status/2070888066378838324",
    source: "x",
    tags: ["ai", "background-jobs", "community"],
    context: "Event-driven AI pipeline",
  },
  {
    id: "varun-async-workflows",
    quote:
      "If you're building async workflows, check out Inngest. It's a great tool for background jobs, AI workflows, and agentic applications. Event-driven execution without the complexity of managing queues or cron jobs.",
    authorName: "Varun Tomar",
    date: "2026-06-26",
    sourceUrl: "https://x.com/varu13029/status/2070459963252899941",
    source: "x",
    tags: ["background-jobs", "ai", "agents", "community"],
    context: "Async workflows",
  },
  {
    id: "bohdan-self-host",
    quote:
      "I'm self-hosting Inngest — super easy to set up. I self-host probably 95% of the whole app stack. On the bright side I didn't even know the internet was down recently worldwide — my app just kept working.",
    authorName: "Bohdan Khodakivskyi",
    date: "2026-06-23",
    sourceUrl: "https://x.com/bohdan_kh/status/2069494974693949650",
    source: "x",
    tags: ["self-host", "trigger-dev", "community"],
    context: "Self-hosting Inngest",
  },
  {
    id: "benblackett-async-automation",
    quote:
      "Use Vercel, Supabase, and Cloudflare. I also recommend Inngest for async automation. My rule of thumb is to keep monthly ops costing less than a single dinner out — that way it stays affordable even with zero income as it ramps up.",
    authorName: "benblackett",
    authorTitle: "r/micro_saas",
    date: "2026-07-18",
    sourceUrl:
      "https://www.reddit.com/r/micro_saas/comments/1uob1bw/how_do_founders_handle_cloud_costs_and_runway/ovsbzsd/",
    source: "reddit",
    tags: ["vercel", "background-jobs", "community"],
    context: "Founder stack on a budget",
  },
];

export function getSocialQuotes(ids: string[]): SocialQuote[] {
  const byId = new Map(SOCIAL_QUOTES.map((q) => [q.id, q]));
  return ids
    .map((id) => byId.get(id))
    .filter((q): q is SocialQuote => q !== undefined);
}

export function getSocialQuotesByTag(tag: string): SocialQuote[] {
  return SOCIAL_QUOTES.filter((q) => q.tags.includes(tag));
}
