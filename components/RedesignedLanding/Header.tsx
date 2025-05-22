"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  DisclosureButton,
  Disclosure,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Dropdown from "src/components/RedesignedLanding/GithubDropdown";
import { RiGithubFill } from "@remixicon/react";
import githubData from "src/data/github.json";
import PlatformPopover, {
  platformDropdown,
} from "src/components/RedesignedLanding/PlatformPopover";
import { Button } from "src/components/RedesignedLanding/Button";
import ResourcePopover, {
  resourceDropdown,
} from "src/components/RedesignedLanding/ResourcePopover";

const navigation = [
  { name: "Docs", href: "#" },
  { name: "Resources", href: "#" },
  { name: "Pricing", href: "#" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky left-0 right-0 top-0 z-50 w-full border-b border-stone-700 bg-stone-950 backdrop-blur-sm">
      <nav
        aria-label="Global"
        className="m-auto flex max-w-container-desktop items-center justify-between p-6 lg:px-8"
      >
        <div className="relative z-10 flex items-center gap-x-6 font-circular text-sm font-medium leading-[1.05rem] text-neutral-50">
          <Link href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Inngest</span>
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
          </Link>
          <div className="hidden lg:gap-x-6 xl:flex">
            <PlatformPopover />
            <Link
              href={"#"}
              className="flex items-center gap-x-1 text-sm/6 font-semibold text-white"
            >
              CUSTOMERS
            </Link>
            <ResourcePopover />
            <Link
              href={"#"}
              className="flex items-center gap-x-1 text-sm/6 font-semibold text-white"
            >
              DOCS
            </Link>
            <Link
              href={"#"}
              className="flex items-center gap-x-1 text-sm/6 font-semibold text-white"
            >
              PRICING
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="items-center rounded-md border border-gray-700 md:flex lg:flex">
            <OpenSourceButton className="rounded-none border-none" />
          </div>
          <div className="hidden space-x-4 xl:flex">
            <Button variant="outline" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/signup">
                Sign up <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
          <div className="flex xl:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-stone-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="mt-2 flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-stone-50"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-stone-700">
              <div className="space-y-0 py-6">
                <Disclosure
                  as="div"
                  className="-mx-3 border-b border-stone-700"
                >
                  <DisclosureButton className="group flex w-full items-center justify-between py-2 pl-3 pr-3.5 text-base/7 font-semibold uppercase text-stone-50">
                    Platform
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="space-y-0 pb-2">
                    <div className="py-2">
                      <h3 className="px-6 pb-2 text-sm font-medium leading-6 text-stone-400">
                        Features
                      </h3>
                      {platformDropdown.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex gap-x-2 px-6 py-3 text-sm font-semibold leading-6 text-stone-50 hover:bg-stone-800"
                        >
                          <div className="flex items-center gap-x-2">
                            {item.icon}
                            <div className="flex flex-col">
                              <span className="text-base text-stone-50">
                                {item.name}
                              </span>
                              {item.description && (
                                <span className="text-xs font-normal text-stone-400">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="mt-4 px-6">
                      <h3 className="pb-2 text-sm font-medium leading-6 text-stone-400">
                        What's new
                      </h3>
                      <article className="relative isolate flex flex-row gap-y-3 pb-2">
                        <div className="relative flex-none">
                          <img
                            alt=""
                            src="/assets/blog/announcing-realtime/featured-image.png"
                            className="aspect-[2/1] max-h-16 rounded-lg bg-gray-100 object-cover"
                          />
                          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                        </div>
                        <div className="flex items-center">
                          <h4 className="ml-4 font-whyte text-sm font-normal leading-[1.05rem] text-stone-50">
                            <a href="#">
                              <span className="absolute inset-0" />
                              Introducing the Fetch APIs: Longer Title mock
                            </a>
                          </h4>
                        </div>
                      </article>
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <Link
                  href="#"
                  className="-mx-3 block border-b border-stone-700 px-3 py-4 text-base/7 font-semibold uppercase text-stone-50 hover:bg-stone-800"
                >
                  Docs
                </Link>

                <Link
                  href="#"
                  className="-mx-3 block border-b border-stone-700 px-3 py-4 text-base/7 font-semibold uppercase text-stone-50 hover:bg-stone-800"
                >
                  Customers
                </Link>

                <Disclosure
                  as="div"
                  className="-mx-3 border-b border-stone-700"
                >
                  <DisclosureButton className="group flex w-full items-center justify-between py-4 pl-3 pr-3.5 text-base/7 font-semibold uppercase text-stone-50">
                    Resources
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="space-y-0 pb-2">
                    <div>
                      {resourceDropdown.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex gap-x-2 px-6 py-3 text-sm font-semibold leading-6 text-stone-50 hover:bg-stone-800"
                        >
                          <div className="flex items-center gap-x-2">
                            {item.icon}
                            <div className="flex flex-col">
                              <span className="text-base text-stone-50">
                                {item.name}
                              </span>
                              {item.description && (
                                <span className="text-xs font-normal text-stone-400">
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="mt-4 px-6">
                      <h3 className="pb-2 text-sm font-medium leading-6 text-stone-400">
                        Latest Blog
                      </h3>
                      <article className="relative isolate flex flex-row gap-y-3 pb-2">
                        <div className="relative flex-none">
                          <img
                            alt=""
                            src="/assets/blog/announcing-realtime/featured-image.png"
                            className="aspect-[2/1] max-h-16 rounded-lg bg-gray-100 object-cover"
                          />
                          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                        </div>
                        <div className="flex items-center">
                          <h4 className="ml-4 font-whyte text-sm font-normal leading-[1.05rem] text-stone-50">
                            <a href="#">
                              <span className="absolute inset-0" />
                              Introducing the Fetch APIs: Longer Title mock
                            </a>
                          </h4>
                        </div>
                      </article>
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <Link
                  href="/pricing"
                  className="-mx-3 block border-b border-stone-700 px-3 py-4 text-base/7 font-semibold uppercase text-stone-50 hover:bg-stone-800"
                >
                  Pricing
                </Link>
              </div>
              <div className="border-none py-6">
                <div className="flex space-x-4">
                  <Button variant="outline" asChild>
                    <Link href="/signin">Sign In</Link>
                  </Button>
                  <Button variant="default" asChild>
                    <Link href="/signup">
                      Sign up <span aria-hidden="true">→</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

const githubStars = githubData.stars;

const repos = [
  "inngest/inngest",
  "inngest/inngest-js",
  "inngest/inngest-py",
  "inngest/inngestgo",
  "inngest/inngest-kt",
  "inngest/agent-kit",
  "inngest/workflow-kit",
];

function OpenSourceButton({ className = "" }: { className?: string }) {
  const items = repos.map((repo) => ({
    href: `https://github.com/${repo}`,
    text: repo,
    target: "_blank",
  }));
  return (
    <Dropdown
      title={
        <>
          <span className="hidden lg:inline">Open Source</span>
          <RiGithubFill className="h-4 w-4 shrink-0" />
          <span>{(githubStars / 1000).toFixed(1)}K</span>
        </>
      }
      items={items}
      className={`${className}`}
    />
  );
}
