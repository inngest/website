"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/utils/v1/cn";

// Side-rail content menu: a gradient-filled, hairline-bordered panel
// listing a page's sections, each with a small square bullet. The active
// section's bullet paints salmon; the rest sit in carbon grey.
//
// The menu is presentational + scroll-spy only — callers pass either a
// flat list of `{ id, text }` items (blog TOC: one entry per heading) or
// a list of `groups` (changelog: entries bucketed by month). The `id`
// must match the `id` of the section element in the DOM. An
// IntersectionObserver watches those elements and drives the
// active-section highlight as the reader scrolls.
//
// In grouped mode the menu behaves like a scroll-spy accordion: only the
// group containing the active entry is expanded; the others collapse to
// just their label. Clicking a group label links to its first entry, so
// the scroll lands there and the group opens.

export type ContentMenuItem = { id: string; text: string };
export type ContentMenuGroup = {
  id: string;
  label: string;
  items: ContentMenuItem[];
};

export default function ContentMenu({
  items,
  groups,
  ariaLabel = "On this page",
  className,
}: {
  items?: ContentMenuItem[];
  groups?: ContentMenuGroup[];
  ariaLabel?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // The flat, ordered id list the observer watches — identical for the
  // flat and grouped shapes.
  const flatItems = useMemo(
    () => (groups ? groups.flatMap((g) => g.items) : items ?? []),
    [groups, items],
  );

  // Re-run only when the set of ids changes (the array identity may
  // differ between renders even when the ids don't).
  const idKey = flatItems.map((i) => i.id).join("|");

  useEffect(() => {
    const elements = flatItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    setActiveId(elements[0].id);

    // Treat a section as "active" once it crosses the upper third of the
    // viewport; the bottom rootMargin keeps the last section highlighted
    // instead of snapping back when it scrolls past centre.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActiveId((visible[0].target as HTMLElement).id);
      },
      { rootMargin: "-96px 0px -66% 0px", threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey]);

  if (flatItems.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "rounded-[8px] border border-v1-strong/[0.35] px-6 py-8",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(-53.62deg, rgba(33,33,33,0) 2.25%, #020202 46.83%)",
      }}
    >
      {groups ? (
        <ul className="flex list-none flex-col gap-6 pl-0">
          {groups.map((group) => {
            const open = group.items.some((it) => it.id === activeId);
            return (
              <li key={group.id} className="list-none">
                {/* Month label — links to the group's first entry so a
                    click scrolls there; scroll-spy then opens the group. */}
                <a
                  href={`#${group.items[0]?.id ?? ""}`}
                  className="flex items-start gap-3 no-underline"
                >
                  <Bullet active={open} />
                  <span className="text-v1-heading-xs text-v1-frost">
                    {group.label}
                  </span>
                </a>
                {/* Collapsible entry list. The 0fr→1fr grid-rows trick
                    animates height without a hard-coded max-height.
                    `aria-hidden` + `tabIndex={-1}` keep collapsed entries
                    out of the a11y tree and tab order while they're hidden. */}
                <div
                  aria-hidden={!open}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="flex list-none flex-col gap-5 pl-5 pt-6">
                      {group.items.map((item) => (
                        <li key={item.id} className="list-none">
                          <MenuLink
                            item={item}
                            active={item.id === activeId}
                            textClass="text-v1-body-sm"
                            tabIndex={open ? undefined : -1}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="flex list-none flex-col gap-6 pl-0">
          {flatItems.map((item) => (
            <li key={item.id} className="list-none">
              <MenuLink
                item={item}
                active={item.id === activeId}
                textClass="text-v1-heading-xs"
              />
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

// A single bullet + label link. Shared by the flat list (blog headings,
// `text-v1-heading-xs`) and the grouped entries (changelog, `text-v1-body-sm`):
// same structure, active item highlighted frost vs frost/80.
function MenuLink({
  item,
  active,
  textClass,
  tabIndex,
}: {
  item: ContentMenuItem;
  active: boolean;
  textClass: string;
  tabIndex?: number;
}) {
  return (
    <a
      href={`#${item.id}`}
      className="flex items-start gap-3 no-underline"
      tabIndex={tabIndex}
    >
      <Bullet active={active} />
      <span
        className={cn(
          textClass,
          "transition-colors duration-300",
          active ? "text-v1-frost" : "text-v1-frost/80",
        )}
      >
        {item.text}
      </span>
    </a>
  );
}

// Small square bullet sitting in a 13px line box, so it centres against a
// single line of label text.
function Bullet({ active }: { active: boolean }) {
  return (
    <span className="flex h-[13px] shrink-0 items-center">
      <span
        aria-hidden="true"
        className={cn(
          "block size-[8px] transition-colors duration-300",
          active ? "bg-v1-accent-salmon" : "bg-v1-carbon-300",
        )}
      />
    </span>
  );
}
