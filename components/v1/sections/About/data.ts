/**
 * About-redesign page content. Pure data (no JSX) so each section
 * file stays focused on layout. The team roster, investor logos,
 * advisor list, perks/values, and related-content cards all live here.
 */

export interface TeamMember {
  name: string;
  title: string;
  /** Optional avatar path. Members without a headshot render as a
   *  text-only card. */
  avatar?: string;
}

// Every member has a headshot except Albert Chae, whose card uses the
// Inngest logomark placeholder (rendered as the empty-state card —
// name + role over the per-card dot-sphere background). Photos are
// transparent grayscale PNG cutouts, resized to 850px and
// palette-quantized; the runtime layers them over `sphere.svg`.
const TEAM_PHOTOS_BASE = "/assets/v1/about-team/photos";
export const TEAM: TeamMember[] = [
  { name: "Tony Holdstock-Brown", title: "CEO & Founder", avatar: `${TEAM_PHOTOS_BASE}/tony.png` },
  { name: "Dan Farrelly", title: "CTO & Founder", avatar: `${TEAM_PHOTOS_BASE}/dan.png` },
  { name: "Jack Williams", title: "Founding Engineer", avatar: `${TEAM_PHOTOS_BASE}/jack.png` },
  { name: "Lauren Craigie", title: "Head of Marketing", avatar: `${TEAM_PHOTOS_BASE}/lauren.png` },
  { name: "Sterling Chin", title: "Head of DevRel", avatar: `${TEAM_PHOTOS_BASE}/sterling.png` },
  { name: "Patrick West", title: "GTM", avatar: `${TEAM_PHOTOS_BASE}/patrick.png` },
  { name: "Pat Holcomb", title: "Growth & Demand Gen", avatar: `${TEAM_PHOTOS_BASE}/pat.png` },
  { name: "John Buchta", title: "Head of Design", avatar: `${TEAM_PHOTOS_BASE}/john.png` },
  { name: "Riley O’Toole", title: "Brand & Experiential", avatar: `${TEAM_PHOTOS_BASE}/rileyo.png` },
  { name: "Albert Chae", title: "Systems Engineer" },
  { name: "Lakshmi Kasinathan", title: "Systems Engineer", avatar: `${TEAM_PHOTOS_BASE}/lakshmi.png` },
  { name: "Scott Numamoto", title: "Systems Engineer", avatar: `${TEAM_PHOTOS_BASE}/scott.png` },
  { name: "Nikhil Nygaard", title: "Infrastructure Engineer", avatar: `${TEAM_PHOTOS_BASE}/nikhil.png` },
  { name: "Riley Wilburn", title: "Systems Engineer", avatar: `${TEAM_PHOTOS_BASE}/rileyw.png` },
  { name: "Sanjana Laddha", title: "Designer", avatar: `${TEAM_PHOTOS_BASE}/sanjana.png` },
  { name: "Aaron Harper", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/aaron.png` },
  { name: "Ana Filipa de Almeida", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/ana.png` },
  { name: "Darwin Wu", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/darwin.png` },
  { name: "Bruno Scheufler", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/bruno.png` },
  { name: "Jacob Heric", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/jacobh.png` },
  { name: "Riadh Daghmoura", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/riadh.png` },
  { name: "Jakob Evangelista", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/jakobe.png` },
  { name: "Andy Lawrence", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/andy.png` },
  { name: "Linell Bonnette", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/linell.png` },
  { name: "Muzammil Abdul Rehman", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/muzammil.png` },
  { name: "Dan Lambright", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/danl.png` },
  { name: "Roy Hubbard", title: "Engineer", avatar: `${TEAM_PHOTOS_BASE}/roy.png` },
];

export interface Investor {
  name: string;
  logo: string;
  featured?: boolean;
  /** Rendered logo dimensions in px. Both width and height are forced
   *  because the SVG exports ship with `preserveAspectRatio="none"` and
   *  `width="100%" height="100%"`, so they stretch to fill any box.
   *  Pinning both axes (matching the viewBox) makes them render at
   *  pixel parity. */
  logoWidth: number;
  logoHeight: number;
}

// Investors split into two rows: featured (h-[213px]) and secondary
// (h-[153px]). `featured: true` belongs to row 1; the rest fall into
// row 2. Per-logo dimensions mirror each wordmark's frame size so the
// optical weights match.
export const INVESTORS: Investor[] = [
  { name: "Andreessen Horowitz", logo: "/assets/v1/about-investors/a16z.svg", featured: true, logoWidth: 243, logoHeight: 77 },
  { name: "Notable Capital", logo: "/assets/v1/about-investors/notable-capital.svg", featured: true, logoWidth: 188, logoHeight: 92 },
  { name: "Altimeter Capital", logo: "/assets/v1/about-investors/altimeter.svg", featured: true, logoWidth: 253, logoHeight: 71 },
  { name: "Afore Capital", logo: "/assets/v1/about-investors/afore.png", logoWidth: 132, logoHeight: 53 },
  { name: "Kleiner Perkins", logo: "/assets/v1/about-investors/kleiner-perkins.svg", logoWidth: 233, logoHeight: 21 },
  { name: "Banana Capital", logo: "/assets/v1/about-investors/banana-capital.svg", logoWidth: 189, logoHeight: 64 },
  { name: "Comma Capital", logo: "/assets/v1/about-investors/comma-capital.png", logoWidth: 230, logoHeight: 33 },
];

// Pre-partitioned so the filter doesn't re-run on every render.
export const FEATURED_INVESTORS = INVESTORS.filter((i) => i.featured);
export const SECONDARY_INVESTORS = INVESTORS.filter((i) => !i.featured);

export interface Advisor {
  name: string;
  role: string;
  avatar?: string;
}

export const ADVISORS: Advisor[] = [
  { name: "Guillermo Rauch", role: "CEO of Vercel", avatar: "/assets/about/guillermo-rauch-avatar.jpg" },
  { name: "Tom Preston-Werner", role: "Founder of Github", avatar: "/assets/about/tom-preston-werner-avatar.png" },
  { name: "Jason Warner", role: "CEO at Poolside" },
  { name: "Jake Cooper", role: "Founder of Railway" },
  { name: "Tristan Handy", role: "CEO & Founder of dbt Labs" },
  { name: "Oana Olteanu", role: "Early stage investor" },
  { name: "Ian Livingstone", role: "The Infra Pod, technical leader" },
  { name: "Pim De Witte", role: "CEO at Medal.tv, Highlight" },
];

// Perks list. Plain single-line entries (no bold prefix) rendered in
// full frost; the salmon marker matches the Values header treatment.
export const PERKS: string[] = [
  "Competitive salary & equity",
  "Remote-first — work from our SF office or anywhere in the world",
  "100% employer paid health, dental, and vision (for you and your dependents)",
  "Unlimited vacation + local national holidays",
  "Twice-annual company offsites",
  "Monthly education, co-working, or technology stipend",
  "401k",
];

// Five "Values" rows, each a bold prefix followed by an explanatory
// sentence on the same line.
export const VALUES: { title: string; body: string }[] = [
  {
    title: "Dig to the root",
    body: "Investigate completely—even when it's uncomfortable.",
  },
  {
    title: "Context is crucial",
    body: "Base your next step on what's important, not what's typical.",
  },
  {
    title: "Good architecture compounds",
    body: "Experiment fast, but be judicious about what becomes canon.",
  },
  {
    title: "Developer first",
    body: "Consider user experience and needs before all else.",
  },
  {
    title: "Respect truth",
    body: "Don't let prior work be the enemy of finding the right answer.",
  },
];

export interface RelatedItem {
  title: string;
  href: string;
}

export const RELATED: RelatedItem[] = [
  {
    title: "Iteration is the new product moat: Announcing our Series A investments",
    href: "/blog/announcing-inngest-series-a?ref=about",
  },
  {
    title: "Inngest + Stripe Projects: Ship Durable Apps Without Leaving the Terminal",
    href: "/blog/inngest-stripe-projects-ship-durable-apps-without-leaving-the-terminal?ref=about",
  },
];
