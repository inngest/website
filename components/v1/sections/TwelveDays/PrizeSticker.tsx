import Image from "next/image";
import type { DailyPrize } from "@/components/v1/sections/TwelveDays/data";

/** Brand yellow. */
const NEON = "#F7DA10";

/**
 * A prize as a die-cut sticker: the art with a solid outline traced
 * around its shape (four offset drop-shadows), plus a soft glow when
 * `glow` is set. Works on transparent PNG cutouts and on emoji alike.
 */
export default function PrizeSticker({
  prize,
  size,
  color = NEON,
  glow = false,
}: {
  prize: DailyPrize;
  size: number;
  color?: string;
  glow?: boolean;
}) {
  const w = Math.max(2, Math.round(size / 24));
  const filter =
    `drop-shadow(${w}px 0 0 ${color}) drop-shadow(-${w}px 0 0 ${color}) ` +
    `drop-shadow(0 ${w}px 0 ${color}) drop-shadow(0 -${w}px 0 ${color})` +
    (glow ? ` drop-shadow(0 0 ${w * 4}px ${color})` : "");

  return prize.image ? (
    <Image
      src={prize.image}
      alt={prize.prize}
      width={size}
      height={size}
      className="h-auto object-contain"
      style={{ width: size, filter }}
    />
  ) : (
    <span
      role="img"
      aria-label={prize.prize}
      className="inline-block select-none leading-none"
      style={{ fontSize: size * 0.82, filter }}
    >
      {prize.emoji}
    </span>
  );
}
