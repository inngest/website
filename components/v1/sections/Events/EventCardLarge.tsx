import Link from "next/link";
import Chip from "@/components/v1/sections/shared/Chip";
import SpotlightFrame from "@/components/v1/sections/Events/SpotlightFrame";
import RegisterCue from "@/components/v1/sections/Events/RegisterCue";
import type { EventItem } from "@/components/v1/sections/Events/data";

// The featured card used in the Upcoming Events list. Hover matches the
// home "Get Started" cards: cursor spotlight + 4px lift + soft shadow
// (no tilt — the card is ~1300px wide, where perspective rotation reads
// as distortion).
export default function EventCardLarge({ ev, newTab }: { ev: EventItem; newTab?: boolean }) {
  return (
    <Link href={ev.href} className="block rounded-lg" {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <SpotlightFrame
        // The card is a flex row at desktop with image at 422.667 of
        // 1300 (≈ 32.51%) and content filling the remainder. Height is
        // content-driven: the explicit date→tags gap below packs the
        // column to 235.734, and `items-stretch` makes the image fill
        // that height alongside the content.
        innerClassName="flex flex-col sm:flex-row sm:items-stretch"
      >
      {/* Image column — placeholder stretched to cover. Desktop width
          is the fixed 32.51% column and height comes from the row
          stretch; mobile uses 16/9 so the image still has a visible area
          when the columns stack. */}
      <div
        aria-hidden="true"
        className={`aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:w-[32.513%]${ev.image ? "" : " opacity-10"}`}
        style={{
          backgroundImage: `url(${ev.image ?? "/assets/v1/events/event-placeholder.png"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="flex flex-col gap-2 p-5 sm:min-w-0 sm:flex-1">
        {/* Title + date sit top-left. */}
        <div className="flex flex-col gap-2 py-2">
          <h3 className="text-v1-heading-sm text-white">{ev.title}</h3>
          <p className="text-v1-body-xs text-[#cfcfcf]/80">{ev.date}</p>
        </div>
        {/* A ~43px gap opens below the date before the tags. With the
            title block's 8px bottom pad + the column's 8px gap, the
            remaining ~27px lives here. */}
        <div className="mt-[27px] flex flex-wrap gap-3">
          {ev.topics.map((t, i) => (
            <Chip key={i} variant="solid" size="sm" className="font-normal">
              {t}
            </Chip>
          ))}
        </div>
        <p className="text-v1-body-xs text-white/80">{ev.excerpt}</p>
        <div className="py-1">
          <RegisterCue />
        </div>
      </div>
      </SpotlightFrame>
    </Link>
  );
}
