"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  RiArrowRightSLine,
  RiArrowDownSLine,
  RiChat1Line,
} from "@remixicon/react";

export default function FloatingCTA({ ctaRef }: { ctaRef: string }) {
  const [open, setOpen] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  return (
    <aside className="fixed bottom-2 right-2">
      {/* Desktop is default open */}
      <div
        className={clsx(
          "hidden sm:block",
          "group relative border border-subtle hover:border-muted rounded-lg text-sm text-basis transition-all bg-canvasBase/20 backdrop-blur-sm cursor-default overflow-hidden",
          open ? "h-[86px] w-[220px] p-3" : "h-[38px] w-[176px] p-2"
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-3 transition-all"
            // !open && "translate-y-10"
          )}
        >
          <span className="pr-6">Interested in Inngest?</span>
          <Link
            href={`/contact?ref=${ctaRef}`}
            className={clsx(
              "flex flex-row gap-1 rounded-md items-center pl-4 pr-3 py-1 bg-cta group-hover:bg-ctaHover text-carbon-1000 font-medium text-onContrast transition-all text-nowrap",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            Talk to a product expert <RiArrowRightSLine className="w-3 h-3" />{" "}
          </Link>
        </div>
        <button
          className={clsx(
            "absolute transition-all",
            open ? "top-3 right-3" : "top-2.5 right-2.5"
          )}
          onClick={() => setOpen(!open)}
        >
          <RiArrowDownSLine
            className={clsx("w-4 h-4 transition-all", !open && "rotate-180")}
          />
        </button>
      </div>
      {/* Mobile is default closed */}
      <div
        className={clsx(
          "sm:hidden",
          "group relative border border-subtle hover:border-muted rounded-lg text-sm text-basis transition-all bg-canvasBase/20 backdrop-blur-sm cursor-default overflow-hidden",
          mobileOpen ? "h-[86px] w-[220px] p-3" : "h-[38px] w-[140px] p-2"
        )}
      >
        <div
          className={clsx(
            "flex flex-col gap-3 transition-all"
            // !open && "translate-y-10"
          )}
        >
          <button
            className="pr-6 flex flex-row items-center gap-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <RiChat1Line className="w-4 h-4" /> Chat with us
          </button>
          <Link
            href={`/contact?ref=${ctaRef}`}
            className={clsx(
              "flex flex-row gap-1 rounded-md items-center pl-4 pr-3 py-1 bg-cta group-hover:bg-ctaHover text-carbon-1000 font-medium text-onContrast transition-all text-nowrap",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            Talk to a product expert <RiArrowRightSLine className="w-3 h-3" />{" "}
          </Link>
        </div>
        <button
          className={clsx(
            "absolute transition-all",
            mobileOpen ? "top-3 right-3" : "top-2.5 right-2.5"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <RiArrowDownSLine
            className={clsx(
              "w-4 h-4 transition-all",
              !mobileOpen && "rotate-180"
            )}
          />
        </button>
      </div>
    </aside>
  );
}
