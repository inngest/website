import { RiCloseCircleLine, RiCheckLine } from "@remixicon/react";
import clsx from "clsx";

export default function Tiles({
  tiles,
  height = "default",
}: {
  tiles: {
    icon?: "x" | "check";
    heading?: string;
    text: string | React.ReactNode; // String should be used for templated pages
  }[];
  height?: "default" | "large";
}) {
  return (
    <div>
      <div className="my-12 mx-auto max-w-[1270px] px-2 flex flex-row flex-wrap items-center justify-center gap-6 text-subtle text-base sm:text-lg leading-6">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            className={clsx(
              "w-auto max-w-[90%] sm:w-[400px] p-px",
              height === "default" && "sm:h-[120px]",
              height === "large" && "sm:h-[175px]",
              "rounded-lg bg-gradient-to-br from-[rgba(var(--color-carbon-400)/0.4)] to-transparent overflow-clip"
            )}
          >
            <div
              className="p-6 h-full flex items-center rounded-lg"
              style={{
                background:
                  "linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #141414",
              }}
            >
              <div className="flex gap-3">
                {tile.icon === "check" ? (
                  <RiCheckLine className="text-success h-5 w-5 mt-1 shrink-0" />
                ) : tile.icon === "x" ? (
                  <RiCloseCircleLine className="text-error h-5 w-5 mt-1 shrink-0" />
                ) : (
                  ""
                )}
                <div className="flex flex-col gap-1 leading-snug">
                  {tile.heading && (
                    <h3 className="font-bold">{tile.heading}</h3>
                  )}
                  <p>{tile.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
