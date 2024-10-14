import React, { forwardRef, Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button";
import {
  isNavLink,
  NavLink,
  NavSection,
  topLevelNav,
} from "./navigationStructure";
import SocialBadges from "./SocialBadges";

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="10" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 10.813 2.438 2.437c1.218-4.469 4.062-6.5 4.062-6.5"
      />
    </svg>
  );
}

function FeedbackButton(props) {
  return (
    <button
      type="submit"
      className="px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-900/2.5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
      {...props}
    />
  );
}

const FeedbackForm = forwardRef<
  HTMLFormElement,
  { onSubmit: React.FormEventHandler }
>(function FeedbackForm({ onSubmit }, ref) {
  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="absolute inset-0 flex items-center justify-center gap-6 md:justify-start"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Was this page helpful?
      </p>
      <div className="group grid h-8 grid-cols-[1fr,1px,1fr] overflow-hidden rounded border border-slate-900/10 dark:border-white/10">
        <FeedbackButton data-response="yes">Yes</FeedbackButton>
        <div className="bg-slate-900/10 dark:bg-white/10" />
        <FeedbackButton data-response="no">No</FeedbackButton>
      </div>
    </form>
  );
});

const FeedbackThanks = forwardRef<HTMLDivElement, {}>(function FeedbackThanks(
  _props,
  ref
) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex justify-center md:justify-start"
    >
      <div className="flex items-center gap-3 rounded-full bg-breeze-50/50 py-1 pr-3 pl-1.5 text-sm text-breeze-900 ring-1 ring-inset ring-breeze-500/20 dark:bg-breeze-500/5 dark:text-breeze-200 dark:ring-breeze-500/30">
        <CheckIcon className="h-5 w-5 flex-none fill-breeze-500 stroke-white dark:fill-breeze-200/20 dark:stroke-breeze-200" />
        Thanks for your feedback!
      </div>
    </div>
  );
});

function Feedback({ page }: { page: string }) {
  let [submitted, setSubmitted] = useState(false);

  function onSubmit(event) {
    event.preventDefault();

    const rating = event.nativeEvent.submitter.dataset.response;

    fetch("/api/feedback/send", {
      method: "POST",
      body: JSON.stringify({
        page,
        rating,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setSubmitted(true);
  }

  return (
    <div className="relative h-8">
      <Transition
        show={!submitted}
        as={Fragment}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        leave="pointer-events-none duration-300"
      >
        <FeedbackForm onSubmit={onSubmit} />
      </Transition>
      <Transition
        show={submitted}
        as={Fragment}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        enter="delay-150 duration-300"
      >
        <FeedbackThanks />
      </Transition>
    </div>
  );
}

function PageLink({ label, page, previous = false }) {
  return (
    <>
      <Button
        href={page.href}
        aria-label={`${label}: ${page.title}`}
        variant="secondaryV2"
        arrow={previous ? "left" : "right"}
        size="sm"
        className="not-prose"
      >
        {label}
      </Button>
      <Link
        href={page.href}
        tabIndex={-1}
        aria-hidden="true"
        className="mx-4 no-underline text-lg font-medium text-slate-900 transition hover:text-slate-600 dark:text-white dark:hover:text-slate-300"
      >
        {page.title}
      </Link>
    </>
  );
}

function flattenNav(nav: any): NavLink[] {
  return nav
    .flatMap((group) => {
      return group.sectionLinks
        ? flattenNav(group.sectionLinks)
        : group.links
        ? flattenNav(group.links)
        : group;
    })
    .filter((link) => !!link.href);
}

function PageNavigation() {
  let router = useRouter();
  let allPages = flattenNav(topLevelNav);
  let currentPageIndex = allPages.findIndex(
    (page) => page.href === router.pathname
  );

  if (currentPageIndex === -1) {
    return null;
  }

  let previousPage = allPages[currentPageIndex - 1];
  let nextPage = allPages[currentPageIndex + 1];

  // Skip next page if it's an external link
  if (!nextPage?.href?.match(/^\//)) {
    nextPage = null;
  }

  if (!previousPage && !nextPage) {
    return null;
  }

  return (
    <div className="flex">
      {previousPage && (
        <div className="flex flex-col items-start gap-3">
          <PageLink label="Previous" page={previousPage} previous />
        </div>
      )}
      {nextPage && (
        <div className="ml-auto flex flex-col items-end gap-3">
          <PageLink label="Next" page={nextPage} />
        </div>
      )}
    </div>
  );
}

const Divider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-900/5 pt-8 dark:border-white/5 sm:flex-row">
      {children}
    </div>
  );
};

function EditPageLink({ url }: { url: string }) {
  return (
    <div className="flex justify-center md:justify-start">
      <Link
        href={url}
        className="flex space-x-2 font-medium text-breeze-600 hover:text-slate-800 hover:underline transition-all duration-150 dark:hover:text-white dark:text-breeze-400"
      >
        <PencilSquareIcon className="h-5" />
        <span>Edit this page on GitHub</span>
      </Link>
    </div>
  );
}

function SmallPrint() {
  return (
    <Divider>
      <div className="text-xs text-slate-600 dark:text-slate-400">
        &copy; {new Date().getFullYear()} Inngest Inc. All rights reserved.
      </div>
      <SocialBadges />
    </Divider>
  );
}

export function Footer({ editPageURL }: { editPageURL: string }) {
  let router = useRouter();

  return (
    <footer className="mx-auto max-w-2xl space-y-8 lg:max-w-none">
      <Feedback key={router.pathname} page={router.pathname} />
      <EditPageLink url={editPageURL} />
      <PageNavigation />
      <SmallPrint />
    </footer>
  );
}
