/**
 * Customers page content. Kept as plain data (no JSX) so the page file
 * stays focused on composition. Story IDs double as the slug used to
 * build the detail URL (`/customers/{id}`) — for the 12 MDX-backed
 * studies the slug resolves to content/customers/{id}.mdx; baerskin-
 * tactical and day-ai resolve to their bespoke app/customers/{id} pages.
 */

export interface StoryCard {
  id: string;
  // `brand` is alt text + sort key; `logo` is the white-on-dark SVG
  // under /public/assets/customers/. Every wordmark renders at the
  // shared `LOGO_HEIGHT` — width auto-derives from the SVG's
  // intrinsic aspect ratio, so per-brand config stays at zero.
  brand: string;
  logo: string;
  // Tags double as the grid filter key — they uppercase-match the
  // CategoryDropdown options (AI / ECOMMERCE / SAAS / SECURITY).
  tags: string[];
  title: string;
  body: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  portrait: string;
  portraitAlt: string;
}

// Story detail URLs resolve to /customers/[slug]; story.id is the slug.
export const STORY_HREF = (id: string) => `/customers/${id}`;

// Shared brand-wordmark render height. Per-logo heights range 21-32 px;
// 24 lands in the middle of the set.
export const LOGO_HEIGHT = 24;

export const STORIES: StoryCard[] = [
  {
    id: "soundcloud",
    brand: "SoundCloud",
    logo: "/assets/customers/soundcloud-logo-white-horizontal.svg",
    tags: ["Saas"],
    title: "Streamlining dynamic video generation",
    body: "Building scalable video pipelines with Inngest.",
  },
  {
    id: "outtake",
    brand: "Outtake",
    logo: "/assets/customers/outtake/outtake-logo.svg",
    tags: ["AI", "Security"],
    title:
      "How Outtake uses Inngest to ensure the reliability of millions of threat scans every minute",
    body: "Outtake's approach demonstrates that effective AI agents require a robust architecture to handle large datasets, manage rate limits, and ensure reliability.",
  },
  {
    id: "baerskin-tactical",
    brand: "BÆRSkin Tactical Supply Co.",
    logo: "/assets/customers/baerskintactical-logo-white.svg",
    tags: ["Ecommerce"],
    title:
      "How BÆRSkin Tactical Supply Co. achieved 100% event deliverability by switching from Kafka to Inngest",
    body: "“We were losing roughly 6% of events going through Kafka. Now that we switched to Inngest, we're super confident that everything is working!”",
  },
  {
    id: "resend",
    brand: "Resend",
    logo: "/assets/customers/resend.svg",
    tags: ["Saas"],
    title: "Scaling a developer email platform with serverless workflows",
    body: "“The DX and visibility with Inngest is really incredible.”",
  },
  {
    id: "cubic",
    brand: "cubic",
    logo: "/assets/customers/cubic/logo.svg",
    tags: ["AI"],
    title:
      "How cubic reduced false positives by 51% by orchestrating their multi-agent system with Inngest",
    body: "For teams looking to build and ship AI Agent systems, cubic's experience highlights the importance of selecting the right orchestration layer.",
  },
  {
    id: "day-ai",
    brand: "Day AI",
    logo: "/assets/customers/day-ai-wordmark.png",
    tags: ["AI"],
    title: "How Day AI built a CRM that can reason using Inngest",
    body: "“Inngest is like the nervous system of Day AI, it makes things reliable by default so we can focus on building.”",
  },
  {
    id: "windmill",
    brand: "Windmill",
    logo: "/assets/customers/windmill-logo.svg",
    tags: ["AI"],
    title:
      "How Windmill's AI Agent helps manage thousands of employees using Inngest",
    body: "How Windmill integrates with 20+ productivity tools to power their AI Agent using Inngest.",
  },
  {
    id: "otto",
    brand: "Otto",
    logo: "/assets/customers/otto-logo.svg",
    tags: ["AI"],
    title: "Leveraging multi-tenant concurrency to scale AI workflows",
    body: "How Otto uses flow control and orchestration to build AI Agents that are as easy as a spreadsheet.",
  },
  {
    id: "aomni",
    brand: "Aomni",
    logo: "/assets/customers/aomni-logo.svg",
    tags: ["AI"],
    title: "Productionizing AI-driven sales flows using serverless LLMs",
    body: "Leveraging Inngest for production-grade complex state management and LLM chaining.",
  },
  {
    id: "gitbook",
    brand: "GitBook",
    logo: "/assets/customers/gitbook-logo-white.svg",
    tags: ["Saas"],
    title: "Solving bi-directional data synchronization",
    body: "How the GitBook team cut sync times from hours to minutes with Inngest's concurrency management.",
  },
  {
    id: "megaseo",
    brand: "Mega SEO",
    logo: "/assets/customers/megaseo-logo.svg",
    tags: ["AI"],
    title: "Powering the Future of AI-Driven Content",
    body: "“The ability to test complex workflows locally has been a game-changer, giving us confidence that our AI-driven processes will run smoothly in production.”",
  },
  {
    id: "fey",
    brand: "Fey",
    logo: "/assets/customers/fey/fey-icon-name.svg",
    tags: ["AI"],
    title: "Orchestrating complex financial data pipelines",
    body: "50x faster and 50x cheaper. How Fey leverages Inngest in data-intensive processes.",
  },
  {
    id: "ocoya",
    brand: "Ocoya",
    logo: "/assets/customers/ocoya.svg",
    tags: ["Ecommerce"],
    title: "Shipping e-commerce import pipelines in record time",
    body: "“We were able to simplify our development process, speed up our time to market, and deliver a better customer experience.”",
  },
  {
    id: "florian-works",
    brand: "Florian Works",
    logo: "/assets/customers/florian-works-logotype.svg",
    tags: ["Saas"],
    title: "Building a mission-critical workflow engine on top of Inngest",
    body: "Saved months of development time and effort building on Inngest's primitives.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "cohere",
    quote:
      "Inngest completely transformed how we handle AI orchestration at Cohere. Its intuitive developer experience, built-in multi-tenant concurrency, and flow control allowed us to scale without the complexity of other tools or the need to build custom solutions. What would have taken us a month.",
    authorName: "Sully Omar",
    authorTitle: "Co-Founder - Cohere",
    portrait: "/assets/v1/customers/otto-sully-omar.png",
    portraitAlt: "Sully Omar, Co-Founder at Cohere",
  },
  {
    id: "diego-escobedo",
    quote:
      "Our pipelines have many interdependent components chained together. Lots can go wrong in that workflow—including unpredictable behavior from the models themselves. Inngest gives us fine-grained control over errors, and how they propagate, so we can just focus on what the agents should do, not what to do when they fail.",
    authorName: "Diego Escobedo",
    authorTitle: "Founding Engineer",
    portrait: "/assets/v1/customers/outtake-diego-escobedo.png",
    portraitAlt: "Diego Escobedo, Founding Engineer at Outtake",
  },
  {
    id: "day-ai",
    quote:
      "Day AI is a complex network of LLMs, data processing, and 3rd party services. Every component in the system needs to wake up at the right times, run for long periods of time, and react intelligently to behavior in other components. Inngest is like the nervous system for all of that, it makes things reliable by default so we can focus on building.",
    authorName: "Erik Munson",
    authorTitle: "Founding Engineer",
    portrait: "/assets/v1/customers/dayai-erik-munson.png",
    portraitAlt: "Erik Munson, Founding Engineer at Day AI",
  },
];
