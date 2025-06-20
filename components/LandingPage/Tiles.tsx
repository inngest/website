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
  const width = tiles.length < 5 ? "large" : "default";
  return (
    <div>
      <div className="mx-auto my-12 flex max-w-[1270px] flex-row flex-wrap items-center justify-center gap-6 px-2 text-base leading-6 text-subtle sm:text-lg">
        {tiles.map((tile, idx) => (
          <div
            key={idx}
            className={clsx(
              "w-auto max-w-[90%] p-px",
              width === "large" && "sm:w-[520px]",
              width === "default" && "sm:w-[400px]",
              height === "default" && "sm:h-[120px]",
              height === "large" && "sm:h-[175px]",
              "overflow-clip bg-stone-800"
            )}
          >
            <div
              className="flex h-full items-center p-6"
              style={{
                background: "bg-stone-800",
              }}
            >
              <div className="flex gap-3">
                {tile.icon === "check" ? (
                  <RiCheckLine className="mt-1 h-5 w-5 shrink-0 text-inngestLux" />
                ) : tile.icon === "x" ? (
                  <RiCloseCircleLine className="mt-1 h-5 w-5 shrink-0 text-error" />
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
