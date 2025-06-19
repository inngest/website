"use client";
import { useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
import Link from "next/link";

export default function Dropdown({
  title,
  items,
  className = "",
}: {
  title: React.ReactNode;
  items: {
    href: string;
    text: string;
    target?: string;
  }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  /**
   * NOTE - This uses md: prefixes to make the button work on hover on desktop and click on mobile
   */
  return (
    <div
      className={`border-input group relative z-20 border text-sm text-basis ${className}`}
    >
      <div
        className="flex h-full flex-row flex-nowrap items-center justify-start gap-2 text-nowrap px-3 py-1 group-hover:bg-[#44403C]"
        onClick={() => setOpen(!open)}
      >
        {title}
        <RiArrowDownSLine
          className={`h-4 w-4 transition-all ${
            open ? "rotate-180 md:rotate-0" : ""
          }`}
        />
      </div>
      <div
        // Only show on hover when non-mobile (> md)
        className={`absolute right-0 w-full min-w-min md:hidden md:group-hover:block ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="h-2 bg-transparent">
          {/* transparent element to persist hover */}
        </div>
        <ul className="border-input flex flex-col gap-2 border bg-surfaceBase px-3 py-2 text-sm">
          {items.map((item, idx) => (
            <li className="" key={idx}>
              <Link
                href={item.href}
                target={item.target}
                className="text-nowrap font-medium text-basis/90 hover:text-inngestLux"
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
