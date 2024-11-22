"use client";
import { useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";

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
      className={`group relative z-20 border border-subtle text-basis rounded-md text-sm ${className}`}
    >
      <div
        className="flex flex-row flex-nowrap items-center justify-start text-nowrap gap-2 px-3 py-1 rounded-md group-hover:bg-canvasSubtle"
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
        <div className="bg-transparent h-2">
          {/* transparent element to persist hover */}
        </div>
        <ul className="flex flex-col gap-2 px-3 py-2 bg-surfaceBase border border-subtle rounded-md text-sm">
          {items.map((item, idx) => (
            <li className="" key={idx}>
              <a
                href={item.href}
                target={item.target}
                className="font-medium text-nowrap text-basis/90 hover:text-primary-intense"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
