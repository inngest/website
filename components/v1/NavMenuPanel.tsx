import Image from "next/image";

import Link from "@/components/v1/Link";
import NavIcon from "@/components/v1/NavIcons";
import { WipeLabel } from "@/components/v1/sections/shared/WipeLabel";
import { appendRef } from "@/utils/v1/ref";
import type {
  NavMenu,
  NavMenuColumn,
  NavMenuItem,
  NavPromo,
} from "@/components/v1/nav-config";
import {
  onCursorSpotlightMove,
  CURSOR_SPOTLIGHT_SEED,
  CURSOR_SPOTLIGHT_BG,
} from "@/utils/v1/cursorFx";
import { cn } from "@/utils/v1/cn";

// Dropdown panel body for the v1 header mega-menus: carbon-500 surface,
// hairline border, 6px radius. Padding/gaps differ by shape — list-only
// menus (Platform, Open Source) pad 32/40; promo menus (Use Cases,
// Resources) pad 32/56 with a 56px gap to the card. The outer width/anchor
// is owned by the Header; this fills it (`w-full`).

// carbon-500 is rgb(124 124 124); /35 == rgba(124,124,124,0.35).
const PANEL_BORDER = "border border-carbon-500/35";

export default function NavMenuPanel({
  menu,
  onNavigate,
}: {
  menu: NavMenu;
  /** Fired when any link inside is activated, so the Header can close
   *  the panel immediately on click (independent of route timing). */
  onNavigate?: () => void;
}) {
  const hasPromo = Boolean(menu.promo);
  const hasColumns = Boolean(menu.columns);

  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onNavigate?.();
      }}
      onPointerMove={onCursorSpotlightMove}
      style={CURSOR_SPOTLIGHT_SEED}
      className={cn(
        "relative isolate w-full overflow-clip rounded-[6px] bg-carbon-1000",
        PANEL_BORDER,
        hasPromo ? "flex gap-14 px-8 py-14" : "px-8 pt-8 pb-10",
        hasColumns ? "items-center" : "items-start"
      )}
    >
      {/* Tray-wide cursor spotlight — the same salmon wash SpotlightFrame
          paints on the Events/Home cards (cursorFx primitive), tracked
          across the whole dropdown surface and clipped to the rounded
          tray by the parent's `overflow-clip`. Sits BEHIND content
          (`-z-10`, above the carbon background) so it warms the surface
          without tinting the white text or the promo image. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: CURSOR_SPOTLIGHT_BG }}
      />
      {menu.items && (
        <MenuItemList items={menu.items} fill={!hasPromo} />
      )}
      {menu.columns && <MenuColumns columns={menu.columns} />}
      {menu.promo && <NavPromoCard promo={menu.promo} />}
    </div>
  );
}

function MenuItemList({
  items,
  fill,
}: {
  items: NavMenuItem[];
  fill: boolean;
}) {
  return (
    <ul className={cn("flex flex-col gap-8", fill && "w-full")}>
      {items.map((item) => (
        <li key={item.label} className={cn(fill && "w-full")}>
          <MenuRow item={item} fill={fill} />
        </li>
      ))}
    </ul>
  );
}

function MenuColumns({ columns }: { columns: NavMenuColumn[] }) {
  return (
    <div className="flex flex-1 items-start justify-center gap-6">
      {columns.map((column) => (
        <div
          key={column.heading}
          className="flex flex-1 flex-col gap-8"
        >
          <p className="text-v1-label-md uppercase text-carbon-200">
            {column.heading}
          </p>
          {column.items.map((item) => (
            <MenuRow key={item.label} item={item} fill />
          ))}
        </div>
      ))}
    </div>
  );
}

// A single menu link: optional leading glyph + title (salmon wipe on
// hover) + optional description. `fill` rows stretch and wrap their
// description (Platform, Resources columns); non-fill rows size to
// content with a single-line description (Use Cases beside the card).
function MenuRow({ item, fill }: { item: NavMenuItem; fill: boolean }) {
  const external = item.href.startsWith("http");
  return (
    <Link
      href={external ? item.href : appendRef(item.href, "nav")}
      underline={false}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      className={cn(
        "group/navrow flex items-start gap-3",
        fill ? "w-full" : "shrink-0"
      )}
    >
      {item.icon && (
        <NavIcon
          name={item.icon}
          className="shrink-0 text-v1-frost motion-safe:transition-colors motion-safe:duration-300 motion-safe:ease-v1-out group-hover/navrow:text-v1-accent-salmon"
        />
      )}
      <span
        className={cn("flex flex-col gap-3", fill ? "flex-1" : "shrink-0")}
      >
        {/* 24px line-box (matches the icon height) with the cap-trimmed
            title centred, so the glyph aligns center-to-center with the
            title text rather than hanging below it. */}
        <span className="flex h-6 items-center">
          <WipeLabel className="text-v1-heading-xs text-white">
            {item.label}
          </WipeLabel>
        </span>
        {item.description && (
          <span
            className={cn(
              "text-v1-body-sm text-v1-frost/70",
              fill ? "w-full" : "whitespace-nowrap"
            )}
          >
            {item.description}
          </span>
        )}
      </span>
    </Link>
  );
}

function NavPromoCard({ promo }: { promo: NavPromo }) {
  const contain = promo.fit === "contain";
  const card = (
    <div
      className={cn(
        "flex h-[350px] w-[400px] shrink-0 flex-col overflow-clip rounded-[6px] motion-safe:transition-colors motion-safe:duration-300",
        PANEL_BORDER,
        promo.href && "hover:border-v1-frost/30"
      )}
    >
      <div
        className={cn(
          "relative min-h-0 w-full flex-1 overflow-clip rounded-[4px]",
          contain && "bg-white"
        )}
      >
        <Image
          src={promo.image}
          alt=""
          fill
          sizes="400px"
          className={cn(contain ? "object-contain" : "object-cover")}
        />
      </div>
      <div className="flex h-[140px] flex-col justify-center gap-5 px-5 pb-6 pt-5">
        <WipeLabel className="text-v1-heading-xs text-white">
          {promo.title}
        </WipeLabel>
        <p className="text-v1-body-sm text-v1-frost/70">{promo.description}</p>
      </div>
    </div>
  );

  if (!promo.href) return card;
  return (
    <Link
      href={appendRef(promo.href, "nav")}
      underline={false}
      className="shrink-0"
    >
      {card}
    </Link>
  );
}
