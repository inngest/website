import Image from "next/image";
import {
  COLORS,
  type DailyPrize,
} from "@/components/v1/sections/TwelveDays/data";

/** Panel colours from the prize cards in Figma, cycled by day. */
const PANELS = [COLORS.salmon, COLORS.green, COLORS.yellow];

export function prizePanelColor(day: number): string {
  return PANELS[(day - 1) % PANELS.length];
}

/**
 * A prize on its coloured panel, as in the "Frame 1000005571" prize cards
 * in the Long Running Campaign Figma file: a brand-colour panel with a
 * thin black border and a heavier bottom-right edge, the product photo
 * (a transparent PNG) centred inside. Prizes without a photo yet show
 * their emoji instead.
 *
 * Size it with `className` (it needs a height); `sizes` is the image's
 * rendered width for next/image.
 */
export default function PrizePanel({
  prize,
  className = "",
  sizes = "160px",
  emojiClassName = "text-[56px]",
}: {
  prize: DailyPrize;
  className?: string;
  sizes?: string;
  emojiClassName?: string;
}) {
  return (
    <div
      className={
        "flex items-center justify-center rounded-[18px] border-[1.5px] border-b-[5px] border-r-[5px] border-[#020202] p-3 " +
        className
      }
      style={{ backgroundColor: prizePanelColor(prize.day) }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {prize.image ? (
          <Image
            src={prize.image}
            alt={prize.prize}
            fill
            sizes={sizes}
            className="object-contain"
          />
        ) : (
          <span
            role="img"
            aria-label={prize.prize}
            className={"select-none leading-none " + emojiClassName}
          >
            {prize.emoji}
          </span>
        )}
      </div>
    </div>
  );
}
