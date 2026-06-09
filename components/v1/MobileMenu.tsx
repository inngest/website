"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import Button from "@/components/v1/Button";
import { GITHUB_STARS_LABEL, GithubMark } from "@/components/v1/GithubStars";
import Link from "@/components/v1/Link";
import Logo from "@/components/v1/Logo";
import {
  NAV_PRIMARY,
  NAV_SECONDARY,
  SIGN_IN_URL,
  SIGN_UP_URL,
  type NavItem,
  type NavMenuItem,
} from "@/components/v1/nav-config";
import { appendRef } from "@/utils/v1/ref";
import { cn } from "@/utils/v1/cn";

/** Flatten a NavMenu into the rows shown in the mobile accordion —
 *  items first, then each column's heading + items. Promo cards are
 *  desktop-only. */
function menuRows(item: NavItem): { heading?: string; items: NavMenuItem[] }[] {
  const menu = item.menu;
  if (!menu) return [];
  const groups: { heading?: string; items: NavMenuItem[] }[] = [];
  if (menu.items?.length) groups.push({ items: menu.items });
  menu.columns?.forEach((col) =>
    groups.push({ heading: col.heading, items: col.items })
  );
  return groups;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Slide-in drawer for the v1 header at < lg widths.
 *
 * Headless UI's `Dialog` handles body scroll lock, focus trap,
 * ESC-to-close, and click-outside automatically. We layer on:
 *   - close on route change (App Router `usePathname`)
 *   - per-row accordion expand for items with sub-menus
 */
export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  // Single open section — opening one collapses any other (accordion).
  const [expanded, setExpanded] = useState<string | null>(null);

  // Close the drawer whenever the route changes — covers browser
  // back/forward and programmatic navigation. Direct in-drawer link
  // clicks also call `onClose` via `onNavigate` for an immediate close
  // before the route transition completes.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggle = (label: string) =>
    setExpanded((prev) => (prev === label ? null : label));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-v1-mobile-menu lg:hidden"
      transition
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-v1-jetBlack/60 backdrop-blur-sm data-[closed]:opacity-0 motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-v1-out"
      />

      <div className="fixed inset-0 overflow-hidden">
        <DialogPanel
          transition
          className="fixed inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-v1-canvasBase text-v1-frost shadow-[0_18px_50px_-24px_rgba(0,0,0,0.55)] data-[closed]:translate-x-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-v1-out"
        >
          <DialogTitle className="sr-only">Navigation</DialogTitle>

          <div className="flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              aria-label="Inngest home"
              className="flex shrink-0 items-center text-v1-frost"
              onClick={onClose}
            >
              <Logo width={104} />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center text-v1-frost"
            >
              <CloseIcon />
            </button>
          </div>

          <nav
            aria-label="Mobile primary"
            className="flex-1 overflow-y-auto px-6 pb-10"
          >
            <ul className="flex flex-col divide-y divide-v1-frost/10">
              {NAV_PRIMARY.map((item) => (
                <PrimaryRow
                  key={item.label}
                  item={item}
                  isExpanded={expanded === item.label}
                  onToggle={() => toggle(item.label)}
                  onNavigate={onClose}
                />
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 border-t border-v1-frost/15 pt-6">
              {NAV_SECONDARY.map((item) => {
                const external = item.href.startsWith("http");
                const label = item.githubStars ? (
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    <GithubMark />
                    {GITHUB_STARS_LABEL}
                  </span>
                ) : (
                  item.label
                );
                return (
                  <Button
                    key={item.label}
                    asChild
                    variant="secondary"
                    size="lg"
                    className="!w-full"
                  >
                    {external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        onClick={onClose}
                      >
                        {label}
                      </a>
                    ) : (
                      <NextLink
                        href={appendRef(item.href, "nav")}
                        onClick={onClose}
                      >
                        {label}
                      </NextLink>
                    )}
                  </Button>
                );
              })}
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="!w-full"
              >
                <a href={appendRef(SIGN_IN_URL, "nav")} onClick={onClose}>
                  Sign in
                </a>
              </Button>
              <Button asChild variant="pill" size="lg" className="!w-full">
                <a href={appendRef(SIGN_UP_URL, "nav")} onClick={onClose}>
                  Start free
                </a>
              </Button>
            </div>
          </nav>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

interface RowProps {
  item: NavItem;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

function PrimaryRow({ item, isExpanded, onToggle, onNavigate }: RowProps) {
  const groups = menuRows(item);
  const hasSubItems = groups.length > 0;
  const rowClass =
    "flex min-h-[56px] w-full items-center justify-between text-left font-v1Heading text-[22px] leading-[1.1] text-v1-frost";

  if (hasSubItems) {
    const id = `mobile-submenu-${slug(item.label)}`;
    return (
      <li>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={id}
          onClick={onToggle}
          className={rowClass}
        >
          <span>{item.label}</span>
          <ChevronIcon
            className={cn(
              "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-v1-out",
              isExpanded && "rotate-180"
            )}
          />
        </button>
        {isExpanded && (
          <div id={id} className="mb-3 flex flex-col gap-4">
            {groups.map((group, gi) => (
              <ul key={group.heading ?? gi} className="flex flex-col">
                {group.heading && (
                  <li className="mb-1 mt-2 font-v1Label text-[12px] uppercase leading-[1] text-carbon-200">
                    {group.heading}
                  </li>
                )}
                {group.items.map((sub) => {
                  const external = sub.href.startsWith("http");
                  return (
                    <li key={sub.label}>
                      <Link
                        href={external ? sub.href : appendRef(sub.href, "nav")}
                        onClick={onNavigate}
                        underline={false}
                        {...(external && {
                          target: "_blank",
                          rel: "noreferrer",
                        })}
                        className="flex min-h-[44px] flex-col justify-center py-1.5"
                      >
                        <span className="font-v1Body text-[16px] text-v1-frost">
                          {sub.label}
                        </span>
                        {sub.description && (
                          <span className="font-v1Body text-[13px] text-v1-frost/60">
                            {sub.description}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={appendRef(item.href, "nav")}
        onClick={onNavigate}
        underline={false}
        className={rowClass}
      >
        {item.label}
      </Link>
    </li>
  );
}

function slug(label: string) {
  return label.toLowerCase().replace(/\s+/g, "-");
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M7 9.5L1.5 4l1-1L7 7.5 11.5 3l1 1z" />
    </svg>
  );
}
