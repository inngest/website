import Image from "next/image";

const WOOD = "/assets/v1/events/codetv/prizes/wooden-table.jpg";
const DIR = "/assets/v1/events/codetv/prizes/stickers";

const STICKERS = [
  {
    src: `${DIR}/aggressively-investing.png`,
    alt: "",
    className: "absolute left-[4%] top-[5%] w-[28%] -rotate-[6deg]",
  },
  {
    src: `${DIR}/dark-mode.png`,
    alt: "",
    className: "absolute left-[36%] top-[8%] w-[26%] rotate-[5deg]",
  },
  {
    src: `${DIR}/watch-your-steps.png`,
    alt: "",
    className: "absolute right-[3%] top-[5%] w-[28%] rotate-[7deg]",
  },
  {
    src: `${DIR}/code-dependent-tendencies.jpg`,
    alt: "",
    className: "absolute left-[8%] top-[44%] w-[84%] rotate-[2deg]",
  },
  {
    src: `${DIR}/retry-me-bro.png`,
    alt: "",
    className: "absolute bottom-[5%] left-[5%] w-[30%] -rotate-[5deg]",
  },
  {
    src: `${DIR}/inngest-blackletter.png`,
    alt: "",
    className: "absolute bottom-[6%] right-[4%] w-[48%] rotate-[4deg]",
  },
] as const;

export default function StickerPack() {
  return (
    <div
      className="absolute inset-0"
      role="img"
      aria-label="Exclusive Inngest sticker pack scattered on a wooden table"
    >
      <Image
        src={WOOD}
        alt=""
        fill
        sizes="(min-width: 1024px) 30vw, 100vw"
        className="object-cover"
      />
      {STICKERS.map((sticker) => (
        <div key={sticker.src} className={sticker.className}>
          <Image
            src={sticker.src}
            alt={sticker.alt}
            width={800}
            height={800}
            className="h-auto w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
          />
        </div>
      ))}
    </div>
  );
}
