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
import Dropdown from "src/components/RedesignedLanding/Header/GithubDropdown";
import { RiGithubFill } from "@remixicon/react";
import githubData from "src/data/github.json";
import { Button } from "src/components/RedesignedLanding/Button";
import PlatformPopover, { platformDropdown } from "./PlatformPopover";
import ResourcePopover, { resourceDropdown } from "./ResourcePopover";
import { featuredBlogPost } from "./helpers";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky left-0 right-0 top-0 z-50 w-full border-b border-stone-700 bg-stone-950 backdrop-blur-sm">
      <nav
        aria-label="Global"
        className="m-auto flex max-w-container-desktop  items-center justify-between p-6 lg:px-8"
      >
        <div className="relative z-10 flex items-center gap-x-6 font-circular text-sm font-medium leading-[1.05rem] text-neutral-50">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Inngest</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 994 176.65"
              width="144"
              height="27"
              className="h-6 w-auto"
            >
              <defs>
                <style>
                  {`.cls-1 {
                    fill: #FAFAF9;
                  }`}
                </style>
              </defs>
              <path className="cls-1" d="M30.66,3.5H0v166h30.66V3.5Z" />
              <path
                className="cls-1"
                d="M613.02,138.51c-5.58,0-10.97-2.32-14.45-6.73-1.21-1.51-2.2-3.17-2.57-4.79-.81-3.54-1.17-7.91-.2-12.83,1.41-7.26,4.51-13.77,4.51-27.77s-3.21-20.59-4.75-27.9c-1.14-5.4-.61-10.14.48-13.88.29-1.11.94-2.23,1.74-3.32,3.45-4.7,9.1-7.23,14.89-7.23h77.8V3.53h-122.31v165.97h124.97v-30.99h-80.11Z"
              />
              <path
                className="cls-1"
                d="M656.09,71.14h-29.49c-8.33,0-15.09,6.82-15.09,15.23s6.75,15.23,15.09,15.23h29.49c8.33,0,15.09-6.82,15.09-15.23s-6.75-15.23-15.09-15.23Z"
              />
              <path
                className="cls-1"
                d="M462.01,76.91v26h47.26c-.33,6.49-1.63,12.26-3.94,17.26-15.02,33.26-67.43,27.21-81.11-4.5-3.98-8.33-5.98-17.96-5.98-28.84,0-10.23,2-19.49,5.98-27.77,3.98-8.28,9.77-14.79,17.33-19.53,7.56-4.72,16.43-7.1,26.55-7.1s18.63,1.86,25.9,5.57c7.26,3.71,14.14,8.85,20.74,15.47l20.38-23.64c-8.44-8.68-18.56-15.56-30.44-20.67-11.88-5.13-24.57-7.71-38.16-7.71-16.4,0-31.01,3.54-43.89,10.64-12.87,7.1-22.89,17.18-29.97,30.26-7.1,13.07-10.64,27.9-10.64,44.45s3.28,31.58,9.83,44.58c19.2,39.59,72.15,52.01,106.42,26.6,3.37-2.76,7.06-4.42,10.23-3.12,2.24.94,3.52,3.34,3.61,5.77.16,4.32.33,5.4.44,8.85h25.38v-92.63h-75.93v.04Z"
              />
              <path
                className="cls-1"
                d="M327.1,3.5l.86,57.87c0,11.34.77,22.77,6.86,31.95,13.08,19.77-3.5,32.86-15.11,19.78L237,3.5h-37.45s0,44.33,0,44.33l.07,70.54c0,4.67-3.81,11.04-11.98,10.53-11.54-.7-9.13-24.41-28.06-45.65L99.55,3.66l-36.18-.16v166h31.54v-50.64c0-12.91.24-29.89-6.16-38.94-10.64-15.06-2.77-26.27,6.62-25.09,4.05.5,6.22,3.45,6.22,3.45l53.35,70.89,30.46,40.34h45.5v-56.73c0-11.34-.24-22.01-5.02-31.91-.26-.5-.44-1.01-.66-1.55-.86-2.03-1.38-4.02-2.02-5.84-2.6-7.73-.37-13.2,3.72-15.54,3.85-2.19,9.1-2.16,13.04,2.32,2.68,3.08,81.05,109.26,81.05,109.26h37.68V3.5h-31.58Z"
              />
              <path
                className="cls-1"
                d="M758.3,35.25c5.48-3.32,13.19-5.11,23.14-5.11,9.17,0,17.39,1.71,24.45,5.03,7.19,3.34,13.57,8.2,19,14.49l4.58,5.31,17.7-24.89-3.14-3.28c-5.48-5.84-11.3-10.73-17.42-14.58-6.13-3.89-13.08-6.95-20.54-9.02-7.48-2.16-15.79-3.21-24.61-3.21-11.85,0-22.65,1.75-32.11,5.31-9.66,3.61-17.53,9.05-23.14,16.32-5.72,7.36-8.62,16.28-8.62,26.38,0,9.26,2.18,17.42,6.66,24.12,4.35,6.55,10.8,12.13,19.04,16.52,8,4.31,18.32,8.04,30.74,11.17l3.71.89.64-2.36-.53,2.36c10.07,2.71,17.79,5.2,22.98,7.39l.93-2.23-.93,2.27c4.75,2.06,8,4.42,9.9,7.03.94,1.29,1.63,2.91,2.11,4.72.4,1.59.7,3.37.7,5.4,0,4.63-1.14,8.32-3.25,11.32-1.1,1.55-2.37,3.01-4.05,4.19-5.32,3.78-13.15,5.92-23.58,5.92-9.78,0-19.09-2.27-27.86-6.66l-1.06,2.16,1.06-2.19c-8.82-4.5-15.75-10.03-20.63-16.48l-4.48-5.97-18.32,25.8,2.81,3.32c7.79,9.05,17.66,16.35,29.31,21.78,11.7,5.51,24.92,8.2,39.17,8.2,12.47,0,23.68-1.92,33.18-5.81,9.7-3.95,17.53-9.94,23.02-17.74,5.56-7.91,8.33-17.46,8.33-28.3,0-9.74-2.31-18.27-6.9-25.26-4.48-6.86-11.28-12.59-19.9-17.09v-.09c-8.4-4.35-19.37-8.24-32.72-11.54l-4.02-.88c-9.1-2.4-16.05-4.63-20.76-6.73-4.31-1.86-7.3-4.11-8.97-6.42-1.63-2.27-2.51-5.16-2.51-9.09,0-2.84.6-5.2,1.74-7.19,1.14-1.99,2.84-3.74,5.32-5.24h-.09l-.05-.02Z"
              />
              <path
                className="cls-1"
                d="M960.95,3.52c-3.1,0-6.18.22-9.24.72-5.76.94-8.47,2.12-11.54,3.48-1.54.68-6.2,3.65-12.36,3.65s-10.09-2.82-11.43-3.39c-2.84-1.22-5.47-2.34-9.9-3.3-3.85-.83-7.78-1.18-11.72-1.18h-32.81v29.91h40.49c5.52,0,9.99,4.55,9.99,10.14v125.95h30.87V43.51c0-5.57,4.47-10.1,9.99-10.1h40.7V3.52h-33.09.04Z"
              />
            </svg>
          </Link>
          <div className="hidden md:flex md:gap-x-6">
            <PlatformPopover />
            <Link
              href={"/customers?ref=nav"}
              className="flex hidden items-center gap-x-1 text-sm/6 font-semibold text-white min-[920px]:flex"
            >
              CUSTOMERS
            </Link>
            <ResourcePopover />
            <Link
              href={"/docs?ref=nav"}
              className="flex items-center gap-x-1 text-sm/6 font-semibold text-white"
            >
              DOCS
            </Link>
            <Link
              href={"/pricing?ref=nav"}
              className="flex hidden items-center gap-x-1 text-sm/6 font-semibold text-white min-[820px]:flex"
            >
              PRICING
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <OpenSourceButton className="h-9 rounded-none border" />
          <div className="hidden space-x-4 md:flex">
            <Button variant="outline" className="hidden xl:flex" asChild>
              <Link href={`${process.env.NEXT_PUBLIC_SIGNIN_URL}?ref=nav`}>
                Sign In
              </Link>
            </Button>
            <Button variant="default" asChild>
              <Link href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=nav`}>
                Sign up <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="z-50 -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:cursor-pointer"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open main menu"}
              </span>
              {mobileMenuOpen ? (
                <XMarkIcon aria-hidden="true" className="size-6" />
              ) : (
                <Bars3Icon aria-hidden="true" className="size-6" />
              )}
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
          <div className="mt-4 flex items-center justify-between">
            <Link
              href="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Inngest</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                id="Layer_1"
                data-name="Layer 1"
                viewBox="0 0 994 176.65"
                width="144"
                height="27"
                className="h-6 w-auto"
              >
                <defs>
                  <style>
                    {`.cls-1 {
                    fill: #FAFAF9;
                  }`}
                  </style>
                </defs>
                <path className="cls-1" d="M30.66,3.5H0v166h30.66V3.5Z" />
                <path
                  className="cls-1"
                  d="M613.02,138.51c-5.58,0-10.97-2.32-14.45-6.73-1.21-1.51-2.2-3.17-2.57-4.79-.81-3.54-1.17-7.91-.2-12.83,1.41-7.26,4.51-13.77,4.51-27.77s-3.21-20.59-4.75-27.9c-1.14-5.4-.61-10.14.48-13.88.29-1.11.94-2.23,1.74-3.32,3.45-4.7,9.1-7.23,14.89-7.23h77.8V3.53h-122.31v165.97h124.97v-30.99h-80.11Z"
                />
                <path
                  className="cls-1"
                  d="M656.09,71.14h-29.49c-8.33,0-15.09,6.82-15.09,15.23s6.75,15.23,15.09,15.23h29.49c8.33,0,15.09-6.82,15.09-15.23s-6.75-15.23-15.09-15.23Z"
                />
                <path
                  className="cls-1"
                  d="M462.01,76.91v26h47.26c-.33,6.49-1.63,12.26-3.94,17.26-15.02,33.26-67.43,27.21-81.11-4.5-3.98-8.33-5.98-17.96-5.98-28.84,0-10.23,2-19.49,5.98-27.77,3.98-8.28,9.77-14.79,17.33-19.53,7.56-4.72,16.43-7.1,26.55-7.1s18.63,1.86,25.9,5.57c7.26,3.71,14.14,8.85,20.74,15.47l20.38-23.64c-8.44-8.68-18.56-15.56-30.44-20.67-11.88-5.13-24.57-7.71-38.16-7.71-16.4,0-31.01,3.54-43.89,10.64-12.87,7.1-22.89,17.18-29.97,30.26-7.1,13.07-10.64,27.9-10.64,44.45s3.28,31.58,9.83,44.58c19.2,39.59,72.15,52.01,106.42,26.6,3.37-2.76,7.06-4.42,10.23-3.12,2.24.94,3.52,3.34,3.61,5.77.16,4.32.33,5.4.44,8.85h25.38v-92.63h-75.93v.04Z"
                />
                <path
                  className="cls-1"
                  d="M327.1,3.5l.86,57.87c0,11.34.77,22.77,6.86,31.95,13.08,19.77-3.5,32.86-15.11,19.78L237,3.5h-37.45s0,44.33,0,44.33l.07,70.54c0,4.67-3.81,11.04-11.98,10.53-11.54-.7-9.13-24.41-28.06-45.65L99.55,3.66l-36.18-.16v166h31.54v-50.64c0-12.91.24-29.89-6.16-38.94-10.64-15.06-2.77-26.27,6.62-25.09,4.05.5,6.22,3.45,6.22,3.45l53.35,70.89,30.46,40.34h45.5v-56.73c0-11.34-.24-22.01-5.02-31.91-.26-.5-.44-1.01-.66-1.55-.86-2.03-1.38-4.02-2.02-5.84-2.6-7.73-.37-13.2,3.72-15.54,3.85-2.19,9.1-2.16,13.04,2.32,2.68,3.08,81.05,109.26,81.05,109.26h37.68V3.5h-31.58Z"
                />
                <path
                  className="cls-1"
                  d="M758.3,35.25c5.48-3.32,13.19-5.11,23.14-5.11,9.17,0,17.39,1.71,24.45,5.03,7.19,3.34,13.57,8.2,19,14.49l4.58,5.31,17.7-24.89-3.14-3.28c-5.48-5.84-11.3-10.73-17.42-14.58-6.13-3.89-13.08-6.95-20.54-9.02-7.48-2.16-15.79-3.21-24.61-3.21-11.85,0-22.65,1.75-32.11,5.31-9.66,3.61-17.53,9.05-23.14,16.32-5.72,7.36-8.62,16.28-8.62,26.38,0,9.26,2.18,17.42,6.66,24.12,4.35,6.55,10.8,12.13,19.04,16.52,8,4.31,18.32,8.04,30.74,11.17l3.71.89.64-2.36-.53,2.36c10.07,2.71,17.79,5.2,22.98,7.39l.93-2.23-.93,2.27c4.75,2.06,8,4.42,9.9,7.03.94,1.29,1.63,2.91,2.11,4.72.4,1.59.7,3.37.7,5.4,0,4.63-1.14,8.32-3.25,11.32-1.1,1.55-2.37,3.01-4.05,4.19-5.32,3.78-13.15,5.92-23.58,5.92-9.78,0-19.09-2.27-27.86-6.66l-1.06,2.16,1.06-2.19c-8.82-4.5-15.75-10.03-20.63-16.48l-4.48-5.97-18.32,25.8,2.81,3.32c7.79,9.05,17.66,16.35,29.31,21.78,11.7,5.51,24.92,8.2,39.17,8.2,12.47,0,23.68-1.92,33.18-5.81,9.7-3.95,17.53-9.94,23.02-17.74,5.56-7.91,8.33-17.46,8.33-28.3,0-9.74-2.31-18.27-6.9-25.26-4.48-6.86-11.28-12.59-19.9-17.09v-.09c-8.4-4.35-19.37-8.24-32.72-11.54l-4.02-.88c-9.1-2.4-16.05-4.63-20.76-6.73-4.31-1.86-7.3-4.11-8.97-6.42-1.63-2.27-2.51-5.16-2.51-9.09,0-2.84.6-5.2,1.74-7.19,1.14-1.99,2.84-3.74,5.32-5.24h-.09l-.05-.02Z"
                />
                <path
                  className="cls-1"
                  d="M960.95,3.52c-3.1,0-6.18.22-9.24.72-5.76.94-8.47,2.12-11.54,3.48-1.54.68-6.2,3.65-12.36,3.65s-10.09-2.82-11.43-3.39c-2.84-1.22-5.47-2.34-9.9-3.3-3.85-.83-7.78-1.18-11.72-1.18h-32.81v29.91h40.49c5.52,0,9.99,4.55,9.99,10.14v125.95h30.87V43.51c0-5.57,4.47-10.1,9.99-10.1h40.7V3.52h-33.09.04Z"
                />
              </svg>
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
                  <DisclosureButton className="group flex w-full items-center justify-between py-4 pl-3 pr-3.5 text-base/7 font-semibold uppercase text-stone-50">
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
                  </DisclosurePanel>
                </Disclosure>

                <Link
                  href="/docs?ref=nav"
                  className="-mx-3 block border-b border-stone-700 px-3 py-4 text-base/7 font-semibold uppercase text-stone-50 hover:bg-stone-800"
                >
                  Docs
                </Link>

                <Link
                  href="/customers?ref=nav"
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
                        Latest blog
                      </h3>
                      <article className="relative isolate flex flex-row gap-y-3 pb-2">
                        <div className="relative flex-none">
                          <img
                            alt=""
                            src={featuredBlogPost.image}
                            className="aspect-[2/1] max-h-16 rounded-lg bg-gray-100 object-cover"
                          />
                          <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                        </div>
                        <div className="flex items-center">
                          <h4 className="ml-4 mt-2 font-whyte text-sm font-normal leading-[1.05rem] text-stone-50">
                            <a href={featuredBlogPost.href}>
                              <span className="absolute inset-0" />
                              {featuredBlogPost.title}
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
                    <Link
                      href={`${process.env.NEXT_PUBLIC_SIGNIN_URL}?ref=nav`}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="default" asChild>
                    <Link
                      href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=nav`}
                    >
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
