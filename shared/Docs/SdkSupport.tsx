import Link from "next/link";
import clsx from "clsx";
import { RiCheckLine, RiSubtractLine } from "@remixicon/react";

import IconTypeScript from "../Icons/TypeScript";
import IconPython from "../Icons/Python";
import IconGo from "../Icons/Go";

type SdkId = "typescript" | "python" | "go";

export type SdkFeature = boolean | { supported: boolean; tag?: string };

export type SdkSupportItem = {
  sdk: SdkId;
  href: string;
  /** Short status tag shown inside the pill, such as "Beta". */
  status?: string;
  /**
   * Capability name -> supported, shown in the hover card in order. Pass an
   * object to add a short tag, such as `{ supported: false, tag: "Planned" }`
   * or `{ supported: true, tag: "v4.8+" }`.
   */
  features?: Record<string, SdkFeature>;
  /** Optional one-line note shown at the bottom of the hover card. */
  note?: string;
};

const SDKS: Record<
  SdkId,
  {
    label: string;
    Icon: (props: { size?: number; className?: string }) => JSX.Element;
    color: string;
    /** Some logos have padding in their viewBox; scale them to match. */
    size?: number;
    fit?: string;
  }
> = {
  typescript: {
    label: "TypeScript",
    Icon: IconTypeScript,
    color: "text-[#3178C6] dark:text-[#6aa6ef]",
  },
  python: {
    label: "Python",
    Icon: IconPython,
    color: "text-[#3776AB] dark:text-[#7fb0e0]",
  },
  go: {
    label: "Go",
    Icon: IconGo,
    color: "text-[#00ADD8] dark:text-[#4fd0ee]",
    size: 28,
    fit: "-my-[7px] -ml-1.5 -mr-0.5",
  },
};

/**
 * Shows which SDKs support a feature, placed under a page's header. Hovering
 * or focusing a pill shows a card with the capabilities that SDK supports.
 */
export function SdkSupport({
  label = "SDK support",
  sdks,
}: {
  label?: string;
  sdks: SdkSupportItem[];
}) {
  return (
    <div className="not-prose -mt-8 mb-12 flex flex-wrap items-center gap-2 text-xs">
      <span className="font-medium text-muted">{label}</span>
      {sdks.map(({ sdk, href, status, features, note }) => {
        const { label: sdkLabel, Icon, color, size = 14, fit } = SDKS[sdk];
        const entries = features ? Object.entries(features) : [];
        return (
          <div key={sdk} className="group relative flex">
            <Link
              href={href}
              className="inline-flex h-7 items-center gap-1.5 rounded-full border border-subtle bg-canvasBase pl-2 pr-2.5 font-medium text-basis transition-colors hover:bg-surfaceSubtle focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha-500/40"
            >
              <Icon size={size} className={clsx("shrink-0", color, fit)} />
              <span>{sdkLabel}</span>
              {status && (
                <span className="rounded-full bg-honey-500/15 px-1.5 py-px text-[10px] font-semibold uppercase leading-4 tracking-wide text-honey-700 dark:text-honey-300">
                  {status}
                </span>
              )}
            </Link>

            {entries.length > 0 && (
              <div
                role="tooltip"
                className="invisible absolute left-0 top-full z-30 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
              >
                <div className="w-72 rounded-lg border border-subtle bg-canvasBase p-3 shadow-lg">
                  <div className="mb-2 flex items-center gap-1.5 font-semibold text-basis">
                    <Icon size={size} className={clsx("shrink-0", color, fit)} />
                    {sdkLabel}
                    {status && (
                      <span className="font-normal text-muted">· {status}</span>
                    )}
                  </div>
                  <ul className="m-0 list-none space-y-1 p-0">
                    {entries.map(([feature, value]) => {
                      const supported =
                        typeof value === "boolean" ? value : value.supported;
                      const tag =
                        typeof value === "boolean" ? undefined : value.tag;
                      const Mark = supported ? RiCheckLine : RiSubtractLine;
                      return (
                        <li
                          key={feature}
                          className={clsx(
                            "m-0 flex items-start gap-1.5 p-0 leading-5",
                            supported ? "text-basis" : "text-muted"
                          )}
                        >
                          <Mark
                            aria-hidden="true"
                            className={clsx(
                              "mt-[3px] h-3.5 w-3.5 shrink-0",
                              supported
                                ? "text-matcha-600 dark:text-matcha-400"
                                : "text-muted"
                            )}
                          />
                          <span className="flex-1">{feature}</span>
                          {tag && (
                            <span className="mt-px shrink-0 rounded bg-surfaceSubtle px-1 py-px text-[10px] font-medium leading-4 text-muted">
                              {tag}
                            </span>
                          )}
                          <span className="sr-only">
                            {supported ? "(supported)" : "(not supported)"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  {note && (
                    <p className="m-0 mt-2 border-t border-subtle pt-2 leading-5 text-muted">
                      {note}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
