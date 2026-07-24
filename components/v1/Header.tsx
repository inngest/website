"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { usePathname } from "next/navigation";

import Link from "@/components/v1/Link";
import Button from "@/components/v1/Button";
import Logo from "@/components/v1/Logo";
import MobileMenu from "@/components/v1/MobileMenu";
import NavMenuPanel from "@/components/v1/NavMenuPanel";
import {
  NAV_PRIMARY,
  NAV_SECONDARY,
  SIGN_IN_URL,
  SIGN_UP_URL,
  type NavItem,
  type NavMenu,
} from "@/components/v1/nav-config";
import { WipeLabel } from "@/components/v1/sections/shared/WipeLabel";
import { GITHUB_STARS_LABEL, GithubMark } from "@/components/v1/GithubStars";
import { appendRef } from "@/utils/v1/ref";
import { cn } from "@/utils/v1/cn";
import { useScrolledPast } from "@/utils/v1/hooks/useScrolledPast";
import { useHeroPanel } from "@/utils/v1/heroNav";

// Scroll distance past which the header collapses to its compact pill.
// Same value used for enter + exit — the actual content-height delta
// on collapse is small enough that flicker hasn't surfaced in practice.
const COMPACT_AT = 40;

// Delay before a hovered-away mega-menu closes — long enough for the
// cursor to cross the gap between the trigger and the panel without
// dropping the open state.
const CLOSE_DELAY = 120;

// Max width for the full-width mega-menu. The bar itself is now
// full-bleed, so without a cap the panel would stretch edge-to-edge on
// wide screens; pin it to the legacy 1440 content frame (1440 − 2×32px
// gutters) and left-align it to the bar's left gutter.
const FULL_WIDTH_MENU_MAX = 1376;

const ALL_NAV: NavItem[] = [...NAV_PRIMARY, ...NAV_SECONDARY];

// Shared id for the single rendered panel — every trigger points its
// `aria-controls` here (the panel only exists while a menu is open).
const MEGA_MENU_ID = "v1-nav-megamenu";

type PanelPos = {
  top: number;
  left: number;
  width: number | null;
  // Transparent padding-top on the wrapper that recreates the trigger→panel
  // gap as a hoverable bridge, so there's no close-triggering deadzone.
  padTop: number;
};

export default function Header() {
  const compact = useScrolledPast(COMPACT_AT, COMPACT_AT);
  const [menuOpen, setMenuOpen] = useState(false);
  // Stable reference so `MobileMenu`'s pathname-change effect doesn't
  // re-fire on every Header render.
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // ── Desktop mega-menu state ──────────────────────────────────────
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [pos, setPos] = useState<PanelPos>({
    top: 0,
    left: 0,
    width: null,
    padTop: 8,
  });
  const headerRef = useRef<HTMLElement>(null);
  // Zero-padding positioning context for the dropdown panel; measuring
  // against this (not the padded frame) keeps `left` correct as the
  // frame's gutters shift on the compact transition.
  const anchorRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLElement>());
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const activeItem = openLabel
    ? ALL_NAV.find((i) => i.label === openLabel)
    : undefined;

  const measure = useCallback((label: string, menu: NavMenu) => {
    const anchor = anchorRef.current;
    const bar = barRef.current;
    if (!anchor || !bar) return;
    const ar = anchor.getBoundingClientRect();
    const br = bar.getBoundingClientRect();
    const trigger = triggerRefs.current.get(label);
    if (!trigger) return;
    const tr = trigger.getBoundingClientRect();
    // Anchor the wrapper at the trigger's bottom edge (not the bar's), and
    // recreate the trigger→panel gap (bar padding below the trigger + the
    // design's 8px) as transparent padding-top on the wrapper. The whole
    // span is then a single hoverable surface, so dragging the cursor from
    // the trigger to the panel never crosses a deadzone that closes it.
    const top = tr.bottom - ar.top;
    const padTop = br.bottom - tr.bottom + 8;

    if (menu.fullWidth) {
      const width = Math.min(br.width, FULL_WIDTH_MENU_MAX);
      setPos({ top, left: br.left - ar.left, width, padTop });
      return;
    }
    const width = menu.width ?? 0;
    let left =
      menu.align === "right"
        ? tr.right - ar.left - width
        : tr.left - ar.left;
    // Keep the panel within the bar's horizontal bounds.
    const min = br.left - ar.left;
    const max = br.right - ar.left - width;
    left = Math.min(Math.max(left, min), Math.max(min, max));
    setPos({ top, left, width, padTop });
  }, []);

  const openNow = useCallback(
    (label: string, menu: NavMenu) => {
      clearTimeout(closeTimer.current);
      measure(label, menu);
      setOpenLabel(label);
    },
    [measure]
  );

  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenLabel(null), CLOSE_DELAY);
  }, []);

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);

  // Clear any pending close timer on unmount.
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Collapse the menu when the header morphs between full/compact — its
  // measured anchor would otherwise be stale.
  useEffect(() => {
    setOpenLabel(null);
  }, [compact]);

  // Re-measure on resize while open; close on Escape or focus leaving
  // the header.
  useEffect(() => {
    if (!openLabel) return;
    const onResize = () => {
      if (activeItem?.menu) measure(activeItem.label, activeItem.menu);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenLabel(null);
    };
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && headerRef.current?.contains(next)) return;
      setOpenLabel(null);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    headerRef.current?.addEventListener("focusout", onFocusOut);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      headerRef.current?.removeEventListener("focusout", onFocusOut);
    };
  }, [openLabel, activeItem, measure]);

  // Close the open menu after a client-side navigation — the Header
  // persists across route changes, so a clicked dropdown link would
  // otherwise leave the panel hanging open over the new page.
  const pathname = usePathname();
  useEffect(() => {
    setOpenLabel(null);
  }, [pathname]);

  // When the transparent (non-compact) header overlaps a SplitHero's
  // SALMON left panel, the primary nav-hover wipe goes jet-black so it
  // stays visible — a salmon wipe would vanish into the salmon panel.
  // (Blue panels read fine with the salmon wipe, and black contrasts
  // poorly on the dark blue, so they're left alone.) The hero publishes
  // its panel via the heroPanel signal (no pathname hardcoding); secondary
  // items sit over the hero's dark right panel and keep their salmon wipe
  // below. Reverts to the default salmon wipe once the header collapses to
  // its dark compact pill.
  const heroPanel = useHeroPanel();
  const wipeFillStyle =
    !compact && heroPanel === "salmon"
      ? ({ ["--v1-wipe-fill" as string]: "rgb(var(--color-v1-jet-black))" } as CSSProperties)
      : undefined;

  // Ink-nav pages have a light/ivory hero, so the transparent (non-
  // compact) header needs dark nav items instead of frost. Scoped to
  // md+ in CSS (the mobile bar stays a solid black band). Reverts to
  // frost the moment the header collapses to its dark compact pill.
  const inkNav = !compact && pathname === "/compare-to-temporal";

  const registerTrigger = (label: string) => (el: HTMLElement | null) => {
    if (el) triggerRefs.current.set(label, el);
    else triggerRefs.current.delete(label);
  };

  // Click toggles (touch / no-hover); hover + focus open via NavTrigger.
  const toggleMenu = (item: NavItem) => {
    if (openLabel === item.label) setOpenLabel(null);
    else if (item.menu) openNow(item.label, item.menu);
  };

  const renderNavItem = (item: NavItem) =>
    item.menu ? (
      <NavTrigger
        item={item}
        isOpen={openLabel === item.label}
        registerRef={registerTrigger(item.label)}
        onOpen={() => openNow(item.label, item.menu!)}
        onScheduleClose={scheduleClose}
        onToggle={() => toggleMenu(item)}
      />
    ) : (
      <NavLink {...item} />
    );

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      style={wipeFillStyle}
      data-ink-nav={inkNav ? "" : undefined}
    >
      {/* Full-bleed container: the bar spans the full page width with
          only the gutters insetting it, so the left group (logo + nav)
          anchors to the left edge and the right group (Open Source /
          Sign in / Start free) anchors to the right — no 1440 cap.
          Mobile: no outer padding — the inner bar paints a solid
          black band edge-to-edge. */}
      <div
        className={cn(
          "w-full motion-safe:transition-[padding] motion-safe:duration-[250ms] motion-safe:ease-v1-out",
          compact ? "md:px-6 md:pt-4" : "md:px-6 lg:px-8"
        )}
      >
        <div ref={anchorRef} className="relative">
          <div
            ref={barRef}
            className={cn(
              "flex items-center justify-between motion-safe:transition-all motion-safe:duration-[250ms] motion-safe:ease-v1-out",
              // Mobile (< md): solid black bar, full-bleed.
              "bg-v1-jetBlack px-4 py-2",
              // md+: defer to the compact/non-compact toggle.
              compact
                ? "md:rounded-md md:bg-v1-surfaceOverlay md:px-1 md:py-1"
                : "md:bg-transparent md:px-0 md:py-3"
            )}
          >
            {/* md:pl-0.5 gives the logo+menu group a 2px inset. */}
            <div className="flex items-center gap-[26px] md:pl-0.5">
              <Link
                href="/"
                aria-label="Inngest home"
                className={cn(
                  "flex shrink-0 items-center text-v1-frost motion-safe:transition-[padding] motion-safe:duration-[250ms] motion-safe:ease-v1-out",
                  // Inset only inside the md+ compact pill — the mobile bar
                  // is a full-bleed band with no pill, so the logo must stay
                  // flush-left and not shift right on scroll.
                  compact && "md:pl-4"
                )}
              >
                {/* Mobile shows the logomark only — the mobile header omits
                    the wordmark. Desktop keeps the full lockup with the
                    compact-on-scroll behaviour. */}
                <Logo width={32} logomarkOnly className="md:hidden" />
                <Logo
                  width={116}
                  compact={compact}
                  className="hidden md:inline-block"
                />
              </Link>
              <nav aria-label="Primary" className="hidden md:block">
                {/* gap fluid via clamp() so items don't wrap between lg
                    (1024) and the larger breakpoints — gap shrinks
                    smoothly from 20px down to 8px instead of forcing
                    the row onto two lines. `flex-nowrap` + per-item
                    whitespace-nowrap belt-and-braces guarantee single
                    line. */}
                <ul
                  className="flex flex-nowrap items-center"
                  style={{ columnGap: "clamp(0.5rem, 0.9vw, 1.25rem)" }}
                >
                  {NAV_PRIMARY.map((item) => (
                    <li key={item.label} className="whitespace-nowrap">
                      {renderNavItem(item)}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div
              className={cn(
                "hidden items-center whitespace-nowrap md:flex",
                // Mirror the logo's compact-pill inset (md:pl-4) on the
                // right so left/right padding stay symmetric in the pill.
                compact && "md:pr-4"
              )}
              style={{ columnGap: "clamp(0.5rem, 0.9vw, 1.5rem)" }}
            >
              {/* Open Source — visible from lg+. On AI page these items
                  wipe SALMON on hover instead of jet-black so they pop
                  against the dark hero like a secondary CTA pair. */}
              {NAV_SECONDARY.map((item) => (
                <div
                  key={item.label}
                  className="hidden lg:block"
                  style={{
                    ["--v1-wipe-fill" as string]:
                      "rgb(var(--color-v1-salmon-200))",
                  }}
                >
                  {renderNavItem(item)}
                </div>
              ))}
              <Link
                href={appendRef(SIGN_IN_URL, "nav")}
                underline={false}
                className="flex h-6 items-center whitespace-nowrap uppercase text-v1-frost"
                style={{
                  ["--v1-wipe-fill" as string]:
                    "rgb(var(--color-v1-salmon-200))",
                }}
              >
                <WipeLabel
                  className="font-v1Label font-semibold leading-[1] tracking-[0.05rem]"
                  style={{ fontSize: "clamp(0.625rem, 0.9vw, 0.75rem)" }}
                >
                  Sign in
                </WipeLabel>
              </Link>
              <Button asChild variant="pill" size="sm">
                <a href={appendRef(SIGN_UP_URL, "nav")}>Start free</a>
              </Button>
            </div>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-v1-frost md:hidden"
            >
              <MenuIcon />
            </button>
          </div>

          {/* Mega-menu panel layer — anchored within the zero-padding
              positioning context, dropped below the bar. Salmon wipe
              fill overrides the AI page's jet-black so dropdown titles
              always paint salmon on hover. */}
          {activeItem?.menu && (
            <div
              id={MEGA_MENU_ID}
              className="absolute z-50 hidden motion-safe:animate-v1-nav-pop md:block motion-safe:transition-[left,top,width] motion-safe:duration-200 motion-safe:ease-v1-out"
              style={{
                top: pos.top,
                left: pos.left,
                width: pos.width ?? undefined,
                paddingTop: pos.padTop,
                ["--v1-wipe-fill" as string]:
                  "rgb(var(--color-v1-salmon-200))",
              }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <NavMenuPanel
                menu={activeItem.menu}
                onNavigate={() => setOpenLabel(null)}
              />
            </div>
          )}
        </div>
      </div>
      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </header>
  );
}

interface NavTriggerProps {
  item: NavItem;
  isOpen: boolean;
  registerRef: (el: HTMLElement | null) => void;
  onOpen: () => void;
  onScheduleClose: () => void;
  onToggle: () => void;
}

function NavTrigger({
  item,
  isOpen,
  registerRef,
  onOpen,
  onScheduleClose,
  onToggle,
}: NavTriggerProps) {
  return (
    <button
      ref={registerRef}
      type="button"
      aria-haspopup="true"
      aria-expanded={isOpen}
      aria-controls={MEGA_MENU_ID}
      // Mouse (not pointer) events so a touch tap doesn't hover-open
      // and then immediately toggle-close via onClick.
      onMouseEnter={onOpen}
      onMouseLeave={onScheduleClose}
      onFocus={onOpen}
      onClick={onToggle}
      className="flex h-6 cursor-pointer items-center gap-1 whitespace-nowrap uppercase text-v1-frost font-v1Label font-semibold leading-[1] tracking-[0.05rem]"
      style={{
        paddingInline: "clamp(0.25rem, 0.45vw, 0.5rem)",
        fontSize: "clamp(0.625rem, 0.9vw, 0.75rem)",
      }}
    >
      {item.githubStars ? (
        <GithubStarsLabel label={item.label} />
      ) : (
        <WipeLabel>{item.label}</WipeLabel>
      )}
      <ChevronDownIcon
        className={cn(
          "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-v1-out",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

// Non-menu nav items (e.g. Customers, Docs). `WipeLabel` controls the
// hover paint, so the label is passed as an element (bypassing `Link`'s
// auto-wrapping of string children).
function NavLink({ label, href }: NavItem) {
  const className =
    "flex h-6 items-center gap-1 whitespace-nowrap uppercase text-v1-frost font-v1Label font-semibold leading-[1] tracking-[0.05rem]";
  const style = {
    paddingInline: "clamp(0.25rem, 0.45vw, 0.5rem)",
    fontSize: "clamp(0.625rem, 0.9vw, 0.75rem)",
  };
  return (
    <Link
      href={appendRef(href, "nav")}
      className={className}
      style={style}
      underline={false}
    >
      <WipeLabel>{label}</WipeLabel>
    </Link>
  );
}

// Nav chevron glyph (13.45 × 4.89) centred in a 24 × 24 box via the
// translate transform.
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        transform="translate(5.2741 9.5568)"
        d="M6.72593 4.88648L13.4518 1.32571L12.75 0L6.72593 3.18923L0.701835 0L0 1.32571L6.72593 4.88648Z"
      />
    </svg>
  );
}

// Open Source trigger label: "OPEN SOURCE · GitHub mark · star count". A
// plain trigger wipes its label salmon via the text-clip `WipeLabel`, but an
// SVG can't ride that, and two separate WipeLabels would wipe at different
// speeds. So to slide the salmon across the whole group as one continuous
// front, stack a salmon copy over the frost base and reveal it left-to-right
// with `clip-path` (same 360ms / ease-v1-wipe as the text wipe).
function GithubStarsLabel({ label }: { label: string }) {
  const content = (
    <>
      <span>{label}</span>
      <GithubMark />
      <span>{GITHUB_STARS_LABEL}</span>
    </>
  );
  return (
    <span
      className="relative inline-flex items-center gap-1"
      aria-label={`${label}, ${GITHUB_STARS_LABEL} GitHub stars`}
    >
      <span aria-hidden className="inline-flex items-center gap-1">
        {content}
      </span>
      <span
        aria-hidden
        className="v1-wipe-reveal absolute inset-0 inline-flex items-center gap-1 text-v1-accent-salmon"
      >
        {content}
      </span>
    </span>
  );
}

function MenuIcon() {
  // Two equal horizontal lines, sized up to match the mobile header
  // weight (~32px).
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 13h22" />
      <path d="M5 19h22" />
    </svg>
  );
}
