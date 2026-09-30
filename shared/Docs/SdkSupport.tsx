import { useEffect, useState, type JSX } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  RiCheckLine,
  RiSubtractLine,
  RiTimeLine,
  RiLoader4Line,
} from "@remixicon/react";

import IconTypeScript from "../Icons/TypeScript";
import IconPython from "../Icons/Python";
import IconGo from "../Icons/Go";

type SdkId = "typescript" | "python" | "go";

export type SdkFeature = boolean | { supported: boolean; tag?: string };

export type SdkSupportItem = {
  sdk: SdkId;
  /** Where the pill links. Planned SDKs don't link. */
  href?: string;
  /** Short status tag shown inside the pill, such as "Beta". */
  status?: string;
  /**
   * Marks the SDK as not yet available. The pill renders muted, and its card
   * offers a "Request interest" button that sends an Inngest event.
   */
  planned?: boolean;
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

const PILL =
  "inline-flex h-7 items-center gap-1.5 rounded-full border pl-2 pr-2.5 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha-500/40";

/**
 * Shows which SDKs support a feature, placed under a page's header. Hovering
 * or focusing a pill shows a card with the capabilities that SDK supports.
 * Planned SDKs render muted and let readers request interest.
 */
export function SdkSupport({
  label = "SDK support",
  feature,
  links,
  sdks,
}: {
  label?: string;
  /** Feature name sent with interest requests, such as "Sandboxes". */
  feature?: string;
  /** Capability name -> docs page. Rows with a link become clickable. */
  links?: Record<string, string>;
  sdks: SdkSupportItem[];
}) {
  return (
    <div className="not-prose -mt-8 mb-12 flex flex-wrap items-center gap-2 text-xs">
      <span className="font-medium text-muted">{label}</span>
      {sdks.map((item) => (
        <SdkPill key={item.sdk} item={item} feature={feature} links={links} />
      ))}
    </div>
  );
}

function SdkPill({
  item: { sdk, href, status, planned, features, note },
  feature,
  links,
}: {
  item: SdkSupportItem;
  feature?: string;
  links?: Record<string, string>;
}) {
  const { label: sdkLabel, Icon, color, size = 14, fit } = SDKS[sdk];
  const entries = features ? Object.entries(features) : [];
  const hasCard = planned || entries.length > 0;

  const pillContent = (
    <>
      <Icon
        size={size}
        className={clsx(
          "shrink-0",
          fit,
          planned ? "text-muted opacity-70" : color
        )}
      />
      <span>{sdkLabel}</span>
      {planned ? (
        <RiTimeLine className="h-3 w-3 shrink-0" aria-label="Planned" />
      ) : (
        status && (
          <span className="rounded-full bg-honey-500/15 px-1.5 py-px text-[10px] font-semibold uppercase leading-4 tracking-wide text-honey-700 dark:text-honey-300">
            {status}
          </span>
        )
      )}
    </>
  );

  return (
    <div className="group relative flex">
      {planned || !href ? (
        <span
          tabIndex={hasCard ? 0 : undefined}
          className={clsx(
            PILL,
            planned
              ? "cursor-default border-dashed border-muted bg-transparent text-muted opacity-70 hover:opacity-100 focus-visible:opacity-100"
              : "border-subtle bg-canvasBase text-basis"
          )}
        >
          {pillContent}
          {planned && <span className="sr-only">(planned)</span>}
        </span>
      ) : (
        <Link
          href={href}
          className={clsx(
            PILL,
            "border-subtle bg-canvasBase text-basis hover:bg-surfaceSubtle"
          )}
        >
          {pillContent}
        </Link>
      )}

      {hasCard && (
        <div
          role="tooltip"
          className="invisible absolute left-0 top-full z-30 pt-2 opacity-0 transition duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        >
          <div className="w-72 rounded-lg border border-subtle bg-canvasBase p-3 shadow-lg">
            <div className="mb-2 flex items-center gap-1.5 font-semibold text-basis">
              <Icon
                size={size}
                className={clsx("shrink-0", fit, planned ? "text-muted" : color)}
              />
              {sdkLabel}
              {(planned || status) && (
                <span className="font-normal text-muted">
                  · {planned ? "Planned" : status}
                </span>
              )}
            </div>

            {entries.length > 0 && (
              <FeatureList
                entries={entries}
                links={links}
                sdk={sdk}
                feature={feature}
              />
            )}

            {planned && (
              <p className="m-0 leading-5 text-muted">
                {note ??
                  `${feature ?? "This feature"} isn't available in the ${sdkLabel} SDK yet. Tell us you need it and we'll prioritize accordingly.`}
              </p>
            )}

            {planned ? (
              <InterestButton feature={feature ?? "unknown"} sdk={sdk} />
            ) : (
              note && (
                <p className="m-0 mt-2 border-t border-subtle pt-2 leading-5 text-muted">
                  {note}
                </p>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureList({
  entries,
  links,
  sdk,
  feature,
}: {
  entries: [string, SdkFeature][];
  links?: Record<string, string>;
  sdk: SdkId;
  feature?: string;
}) {
  return (
    <ul className="m-0 list-none space-y-1 p-0">
      {entries.map(([name, value]) => {
        const supported = typeof value === "boolean" ? value : value.supported;
        const tag = typeof value === "boolean" ? undefined : value.tag;
        const Mark = supported ? RiCheckLine : RiSubtractLine;
        const href = links?.[name];
        return (
          <li
            key={name}
            className={clsx(
              "m-0 flex items-start gap-1.5 p-0 leading-5",
              supported ? "text-basis" : "text-muted"
            )}
          >
            <Mark
              aria-hidden="true"
              className={clsx(
                "mt-[3px] h-3.5 w-3.5 shrink-0",
                supported ? "text-matcha-600 dark:text-matcha-400" : "text-muted"
              )}
            />
            <span className="flex-1">
              {href ? (
                <Link
                  href={href}
                  className="text-inherit underline decoration-transparent underline-offset-2 transition-colors hover:text-basis hover:decoration-current"
                >
                  {name}
                </Link>
              ) : (
                name
              )}
            </span>
            {tag && (
              <span className="mt-px shrink-0 rounded bg-surfaceSubtle px-1 py-px text-[10px] font-medium leading-4 text-muted">
                {tag}
              </span>
            )}
            {!supported && (
              <InlineInterest
                feature={feature ?? "unknown"}
                capability={name}
                sdk={sdk}
              />
            )}
            <span className="sr-only">
              {supported ? "(supported)" : "(not supported)"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

type RequestState = "idle" | "sending" | "sent" | "error";

function useInterest(feature: string, sdk: SdkId, capability?: string) {
  const storageKey = `sdk-interest:${feature}:${sdk}${
    capability ? `:${capability}` : ""
  }`;
  const [state, setState] = useState<RequestState>("idle");

  // Remember a sent request in this browser. Read after mount to avoid a
  // hydration mismatch.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey)) setState("sent");
    } catch {
      // Storage can be unavailable in private windows.
    }
  }, [storageKey]);

  const request = async () => {
    setState("sending");
    try {
      const res = await fetch("/api/docs/sdk-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature,
          sdk,
          capability,
          page: window.location.pathname,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {
        // Storage can be unavailable; the request still went through.
      }
      setState("sent");
    } catch {
      setState("error");
    }
  };

  return { state, request };
}

function InlineInterest({
  feature,
  capability,
  sdk,
}: {
  feature: string;
  capability: string;
  sdk: SdkId;
}) {
  const { state, request } = useInterest(feature, sdk, capability);
  if (state === "sent") {
    return (
      <span className="mt-px inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium leading-4 text-matcha-700 dark:text-matcha-300">
        <RiCheckLine className="h-3 w-3" aria-hidden="true" />
        Requested
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={request}
      disabled={state === "sending"}
      title={`Request ${capability} in the ${SDKS[sdk].label} SDK`}
      className={clsx(
        "mt-px shrink-0 rounded border px-1.5 py-px text-[10px] font-medium leading-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha-500/40 disabled:opacity-60",
        state === "error"
          ? "border-ruby-500/40 text-ruby-600 dark:text-ruby-400"
          : "border-subtle text-muted hover:border-matcha-500/50 hover:bg-matcha-500/10 hover:text-matcha-700 dark:hover:text-matcha-300"
      )}
    >
      {state === "sending" ? "Sending…" : state === "error" ? "Retry" : "Request"}
    </button>
  );
}

function InterestButton({ feature, sdk }: { feature: string; sdk: SdkId }) {
  const { state, request } = useInterest(feature, sdk);

  if (state === "sent") {
    return (
      <p className="m-0 mt-3 flex items-center gap-1.5 rounded-md bg-matcha-500/10 px-2.5 py-2 font-medium text-matcha-700 dark:text-matcha-300">
        <RiCheckLine className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Thanks. We've noted your interest.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={request}
        disabled={state === "sending"}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-matcha-600 px-3 py-1.5 font-semibold text-white transition-colors hover:bg-matcha-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-matcha-500/40 disabled:opacity-70"
      >
        {state === "sending" && (
          <RiLoader4Line className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        )}
        Request interest
      </button>
      {state === "error" && (
        <p className="m-0 mt-1.5 text-ruby-600 dark:text-ruby-400" role="alert">
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
