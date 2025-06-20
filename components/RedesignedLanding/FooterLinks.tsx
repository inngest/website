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
    { name: "About", href: "/about?ref=homepage-footer-links" },
    { name: "Careers", href: "/careers?ref=homepage-footer-links" },
  ],
  community: [
    { name: "Discord", href: "https://www.inngest.com/discord?ref=footer" },
    { name: "GitHub", href: "https://github.com/inngest/inngest" },
    { name: "X.com", href: "https://x.com/inngest" },
    { name: "Bluesky", href: "https://bsky.app/profile/inngest.com" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "X",
      href: "#",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "#",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
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

export function FooterLinks2() {
  return (
    <footer className="bg-stone-950">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <svg
              width="144"
              height="27"
              viewBox="0 0 144 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_4268_10527"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="147"
                height="27"
              >
                <path
                  d="M146.923 0.710938H0V26.3013H146.923V0.710938Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_4268_10527)">
                <path d="M4.44221 1H0V25H4.44221V1Z" fill="#FAFAF9" />
                <path
                  d="M88.8072 20.5153C87.9995 20.5153 87.2184 20.1794 86.7136 19.5424C86.5383 19.3238 86.3948 19.0839 86.3417 18.8493C86.2248 18.3375 86.1716 17.7057 86.3124 16.994C86.517 15.9437 86.966 15.0027 86.966 12.9795C86.966 10.9563 86.5011 10.0019 86.2779 8.94634C86.1132 8.1653 86.1902 7.48023 86.347 6.9391C86.3895 6.77916 86.4825 6.61655 86.5994 6.45928C87.0989 5.77953 87.9172 5.41434 88.7567 5.41434H100.027V1H82.3086L82.3086 24.9959H100.412V20.5153H88.8125H88.8072Z"
                  fill="#FAFAF9"
                />
                <path
                  d="M95.0486 10.7812H90.7764C89.5702 10.7812 88.5898 11.7675 88.5898 12.9831C88.5898 14.1986 89.5676 15.1849 90.7764 15.1849H95.0486C96.2548 15.1849 97.2352 14.1986 97.2352 12.9831C97.2352 11.7675 96.2574 10.7812 95.0486 10.7812Z"
                  fill="#FAFAF9"
                />
                <path
                  d="M66.9289 11.611V15.3696H73.7756C73.7277 16.3079 73.5391 17.1423 73.2043 17.8647C71.0284 22.6735 63.4352 21.7992 61.4532 17.2142C60.8767 16.0094 60.5871 14.6179 60.5871 13.0451C60.5871 11.5657 60.8767 10.2275 61.4532 9.03065C62.0297 7.83377 62.8693 6.89279 63.9639 6.20772C65.0585 5.52531 66.3444 5.18144 67.811 5.18144C69.2776 5.18144 70.5103 5.45067 71.5624 5.98647C72.6145 6.52227 73.6108 7.26599 74.5673 8.22296L77.519 4.80558C76.2969 3.55005 74.8303 2.55576 73.1087 1.81737C71.3871 1.07632 69.5486 0.703125 67.5798 0.703125C65.2046 0.703125 63.0872 1.21493 61.2221 2.24121C59.357 3.26749 57.9063 4.72561 56.8808 6.61556C55.8526 8.50552 55.3398 10.6487 55.3398 13.0425C55.3398 15.4362 55.8154 17.6088 56.7639 19.488C59.5456 25.2112 67.2159 27.0079 72.1815 23.3346C72.6703 22.9347 73.2043 22.6948 73.664 22.8841C73.9881 23.0201 74.1741 23.3666 74.1874 23.7185C74.2113 24.3422 74.2352 24.4992 74.2511 24.9976H77.9282V11.6057H66.9289V11.611Z"
                  fill="#FAFAF9"
                />
                <path
                  d="M47.3875 1L47.5124 9.36627C47.5124 11.0056 47.624 12.6584 48.506 13.9859C50.4004 16.8434 47.9986 18.7361 46.3168 16.8461L34.3344 1L28.9093 0.99999V7.40967L28.9199 17.6085C28.9199 18.2829 28.3673 19.2052 27.185 19.1306C25.5139 19.0293 25.8619 15.6013 23.1201 12.5304L14.4216 1.02274L9.17969 1.00001V25H13.7494V17.6778C13.7494 15.8118 13.784 13.3568 12.8567 12.0479C11.3158 9.87008 12.4556 8.24935 13.8158 8.41996C14.403 8.49193 14.7165 8.91844 14.7165 8.91844L22.4452 19.1679L26.8582 25H33.4498V16.7981C33.4498 15.1588 33.4153 13.6153 32.7218 12.1839C32.6846 12.1119 32.6581 12.0373 32.6262 11.96C32.5013 11.6667 32.4269 11.3788 32.3339 11.1149C31.9567 9.99803 32.2808 9.20633 32.8733 8.86779C33.4312 8.55057 34.1911 8.55591 34.7623 9.20366C35.1502 9.64883 46.5034 25 46.5034 25H51.9626V1H47.3875Z"
                  fill="#FAFAF9"
                />
                <path
                  d="M109.856 5.79987C110.651 5.32005 111.766 5.06148 113.209 5.06148C114.537 5.06148 115.728 5.30939 116.751 5.78921C117.792 6.27169 118.717 6.97543 119.503 7.88442L120.167 8.65213L122.731 5.05349L122.277 4.579C121.482 3.73398 120.64 3.02758 119.753 2.47046C118.865 1.908 117.859 1.4655 116.777 1.16695C115.693 0.855068 114.49 0.703125 113.212 0.703125C111.495 0.703125 109.931 0.956363 108.56 1.47084C107.159 1.99331 106.02 2.77968 105.207 3.82995C104.378 4.89355 103.958 6.18373 103.958 7.64451C103.958 8.98267 104.274 10.1636 104.922 11.1312C105.552 12.0775 106.487 12.8852 107.68 13.5196C108.839 14.1434 110.334 14.6819 112.133 15.135L112.67 15.263L112.763 14.9218L112.686 15.263C114.144 15.6548 115.263 16.0147 116.015 16.3319L116.15 16.0094L116.015 16.3372C116.703 16.6358 117.173 16.977 117.449 17.3529C117.585 17.5394 117.686 17.774 117.755 18.0353C117.813 18.2645 117.856 18.5231 117.856 18.8163C117.856 19.4854 117.691 20.0185 117.386 20.453C117.226 20.6769 117.043 20.8875 116.798 21.0581C116.028 21.6046 114.894 21.9138 113.382 21.9138C111.966 21.9138 110.616 21.5859 109.346 20.9515L109.192 21.2634L109.346 20.9462C108.068 20.2957 107.064 19.496 106.357 18.5631L105.709 17.6994L103.055 21.4286L103.461 21.9085C104.59 23.2173 106.02 24.2729 107.707 25.0566C109.402 25.8536 111.317 26.2428 113.382 26.2428C115.188 26.2428 116.812 25.9656 118.188 25.4031C119.593 24.8327 120.728 23.9664 121.522 22.8388C122.327 21.6952 122.728 20.3144 122.728 18.747C122.728 17.3395 122.394 16.1053 121.73 15.095C121.081 14.1034 120.096 13.2744 118.847 12.624V12.6106C117.63 11.9815 116.041 11.4191 114.107 10.9419L113.525 10.814C112.207 10.4674 111.201 10.1449 110.518 9.84102C109.893 9.57178 109.46 9.24657 109.219 8.91336C108.982 8.58549 108.855 8.16698 108.855 7.59919C108.855 7.18868 108.942 6.84748 109.107 6.55958C109.272 6.27169 109.519 6.01846 109.877 5.80254H109.864L109.856 5.79987Z"
                  fill="#FAFAF9"
                />
              </g>
              <path
                d="M139.213 1.00267C138.764 1.00267 138.317 1.03465 137.874 1.10663C137.039 1.24258 136.646 1.41318 136.202 1.61044C135.979 1.70907 135.304 2.13824 134.412 2.13824C133.519 2.13824 132.951 1.73039 132.757 1.64776C132.345 1.47182 131.965 1.30922 131.322 1.1706C130.764 1.05065 130.195 1 129.624 1H124.871V5.3237H130.737C131.537 5.3237 132.185 5.98212 132.185 6.78982V25H136.657V6.78449C136.657 5.97946 137.305 5.3237 138.105 5.3237H144V1.00267H139.207H139.213Z"
                fill="#FAFAF9"
              />
            </svg>
            <StatusWidget />
            <div className="flex gap-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon aria-hidden="true" className="size-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-inngestLux">
                  Platform
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.platform.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-gray-300"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-inngestLux">
                  Explore
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.explore.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-gray-300"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-inngestLux">
                  Company
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-gray-300"
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
                        className="text-sm/6 text-gray-400 hover:text-gray-300"
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
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-sm/6 text-gray-400">
            &copy; 2024 Inngest, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
