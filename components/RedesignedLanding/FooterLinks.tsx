import StatusWidget from "src/shared/StatusWidget";

export const navigation = {
  platform: [
    { name: "AI & Agents", href: "/ai?ref=homepage-footer-links" },
    {
      name: "Durable Workflows",
      href: "/uses/durable-workflows?ref=homepage-footer-links",
    },
    { name: "Platform", href: "/platform?ref=homepage-footer-links" },
    {
      name: "Queueing",
      href: "/compare-to-legacy-queues?ref=homepage-footer-links",
    },
    {
      name: "Workflow Engines",
      href: "/uses/workflow-engine?ref=homepage-footer-links",
    },
    {
      name: "Background Jobs",
      href: "/uses/serverless-node-background-jobs?ref=homepage-footer-links",
    },
    {
      name: "Scheduled and cron jobs",
      href: "/uses/serverless-cron-jobs?ref=homepage-footer-links",
    },
  ],
  explore: [
    { name: "Docs", href: "/docs?ref=homepage-footer-links" },
    {
      name: "Inngest vs. Traditional Queues",
      href: "/compare-to-legacy-queues?ref=homepage-footer-links",
    },
    {
      name: "Inngest vs. Kafka",
      href: "/blog/simplifying-queues-modern-kafka-alternative",
    },
    {
      name: "Inngest vs. Temporal",
      href: "/compare-to-temporal?ref=homepage-footer-links",
    },
    {
      name: "Solving for Vercel Timeouts",
      href: "/blog/vercel-function-timeout",
    },
  ],
  company: [
    { name: "Blog", href: "/blog?ref=homepage-footer-links" },
    { name: "Changelog", href: "/changelog?ref=homepage-footer-links" },
    { name: "Roadmap", href: "https://roadmap.inngest.com/roadmap?ref=footer" },
    { name: "Careers", href: "/careers?ref=homepage-footer-links" },
    { name: "Privacy", href: "/privacy?ref=homepage-footer-links" },
    { name: "Terms", href: "/terms?ref=homepage-footer-links" },
    { name: "Security", href: "/security?ref=homepage-footer-links" },
  ],
  community: [
    { name: "Discord", href: "https://www.inngest.com/discord?ref=footer" },
    { name: "GitHub", href: "https://github.com/inngest/inngest" },
    { name: "X.com", href: "https://x.com/inngest" },
    { name: "Bluesky", href: "https://bsky.app/profile/inngest.com" },
  ],
};

export default function FooterLinks() {
  return (
    <div className="max-w-screen relative z-10 mx-auto border-t border-white/10 px-6 lg:px-8">
      <div className="pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-sm/6 font-semibold text-inngestLux">
                Platform
              </h3>
              <ul role="list" className="mt-5 space-y-4">
                {navigation.platform.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm/6 text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm/6 font-semibold text-inngestLux">
                Explore
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.explore.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm/6 text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm/6 font-semibold text-inngestLux">
                Company
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm/6 text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm/6 font-semibold text-inngestLux">
                Community
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.community.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm/6 text-gray-400 hover:text-white"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto my-12 max-w-6xl items-center justify-center pt-8 md:flex md:justify-between">
        <div className="flex justify-center gap-6 md:order-1 md:items-start md:justify-start">
          <StatusWidget />
        </div>
        <p className="mt-8 items-center text-center text-sm/6 text-gray-400 md:order-2 md:mt-0 md:text-end">
          &copy; {new Date().getFullYear()} Inngest Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
}
