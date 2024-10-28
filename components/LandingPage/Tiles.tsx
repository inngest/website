import { RiCloseCircleLine } from "@remixicon/react";

export default function Tiles({
  tiles,
}: {
  tiles: {
    text: string;
  }[];
}) {
  return (
    <div>
      {/* ghost tiles in bg */}
      <div className="my-12 flex flex-row flex-wrap items-center justify-center gap-6 text-subtle text-base sm:text-lg leading-6">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            className="w-auto max-w-[90%] sm:w-[400px] sm:h-[120px] p-px rounded-lg bg-gradient-to-br from-[rgba(var(--color-carbon-400)/0.4)] to-transparent overflow-clip"
          >
            <div
              className="p-6 h-full flex items-center rounded-lg"
              style={{
                background:
                  "linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #141414",
              }}
            >
              <div className="flex gap-3">
                <RiCloseCircleLine className="text-error h-5 w-5 mt-1 shrink-0" />
                {tile.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
