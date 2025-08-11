import Link from "next/link";
import StatusWidget from "src/shared/StatusWidget";

export const navigation = {
  platform: [
    { name: "AI & Agents", href: "/ai?ref=footer-links" },
    {
      name: "Durable Workflows",
      href: "/uses/durable-workflows?ref=footer-links",
    },
    { name: "Platform", href: "/platform?ref=footer-links" },
    {
      name: "Queueing",
      href: "/compare-to-legacy-queues?ref=footer-links",
    },
    {
      name: "Workflow Engines",
      href: "/uses/workflow-engine?ref=footer-links",
    },
    {
      name: "Background Jobs",
      href: "/uses/serverless-node-background-jobs?ref=footer-links",
    },
    {
      name: "Scheduled and cron jobs",
      href: "/uses/serverless-cron-jobs?ref=homepage-footer-links",
    },
  ],
  explore: [
    { name: "Docs", href: "/docs?ref=footer-links" },
    {
      name: "Inngest vs. Traditional Queues",
      href: "/compare-to-legacy-queues?ref=footer-links",
    },
    {
      name: "Inngest vs. Kafka",
      href: "/blog/simplifying-queues-modern-kafka-alternative?ref=footer-links",
    },
    {
      name: "Inngest vs. Temporal",
      href: "/compare-to-temporal?ref=footer-links",
    },
    {
      name: "Solving for Next.js Timeouts",
      href: "/blog/how-to-solve-nextjs-timeouts?ref=footer-links",
    },
  ],
  company: [
    { name: "Blog", href: "/blog?ref=footer-links" },
    { name: "Changelog", href: "/changelog?ref=footer-links" },
    {
      name: "Roadmap",
      href: "https://roadmap.inngest.com/roadmap?ref=footer-links",
    },
    { name: "About", href: "/about?ref=footer-links" },
    { name: "Careers", href: "/careers?ref=footer-links" },
  ],
  community: [
    {
      name: "Discord",
      href: "/discord?ref=footer-links",
    },
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
        <div className="flex justify-center gap-6 md:items-start md:justify-start">
          <StatusWidget />
        </div>
        <div className="flex flex-col items-center justify-center md:items-end">
          <p className="mt-8 items-center text-center text-sm/6 text-gray-400 md:mt-0 md:text-end">
            &copy; {new Date().getFullYear()} Inngest Inc. All rights reserved.
          </p>
          <div className="flex flex-row justify-end  text-sm/6 text-stone-500">
            <Link
              href="/privacy?ref=footer-links"
              className="px-1 hover:underline"
            >
              Privacy Policy
            </Link>
            <div>|</div>
            <Link
              href="/terms?ref=footer-links"
              className="px-1 hover:underline"
            >
              Terms
            </Link>
            <div>|</div>
            <Link
              href="/security?ref=footer-links"
              className="pl-1 hover:underline"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
