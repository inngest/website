import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/compat/router";
import * as Popover from "@radix-ui/react-popover";
import {
  RiFileCopyLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiGithubFill,
  RiOpenaiFill,
  RiChat1Line,
  RiBrainLine,
} from "@remixicon/react";
import clsx from "clsx";

// Scira AI icon component
function SciraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="910"
      height="934"
      viewBox="0 0 910 934"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M647.664 197.775C569.13 189.049 525.5 145.419 516.774 66.8849C508.048 145.419 464.418 189.049 385.884 197.775C464.418 206.501 508.048 250.131 516.774 328.665C525.5 250.131 569.13 206.501 647.664 197.775Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M516.774 304.217C510.299 275.491 498.208 252.087 480.335 234.214C462.462 216.341 439.058 204.251 410.333 197.775C439.059 191.3 462.462 179.209 480.335 161.336C498.208 143.463 510.299 120.06 516.774 91.334C523.25 120.059 535.34 143.463 553.213 161.336C571.086 179.209 594.49 191.3 623.216 197.775C594.49 204.251 571.086 216.341 553.213 234.214C535.34 252.087 523.25 275.491 516.774 304.217Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M857.5 508.116C763.259 497.644 710.903 445.288 700.432 351.047C689.961 445.288 637.605 497.644 543.364 508.116C637.605 518.587 689.961 570.943 700.432 665.184C710.903 570.943 763.259 518.587 857.5 508.116Z"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinejoin="round"
      />
      <path
        d="M700.432 615.957C691.848 589.05 678.575 566.357 660.383 548.165C642.191 529.973 619.499 516.7 592.593 508.116C619.499 499.533 642.191 486.258 660.383 468.066C678.575 449.874 691.848 427.181 700.432 400.274C709.015 427.181 722.289 449.874 740.481 468.066C758.673 486.258 781.365 499.533 808.271 508.116C781.365 516.7 758.673 529.973 740.481 548.165C722.289 566.357 709.015 589.05 700.432 615.957Z"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinejoin="round"
      />
      <path
        d="M889.949 121.237C831.049 114.692 798.326 81.9698 791.782 23.0692C785.237 81.9698 752.515 114.692 693.614 121.237C752.515 127.781 785.237 160.504 791.782 219.404C798.326 160.504 831.049 127.781 889.949 121.237Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M791.782 196.795C786.697 176.937 777.869 160.567 765.16 147.858C752.452 135.15 736.082 126.322 716.226 121.237C736.082 116.152 752.452 107.324 765.16 94.6152C777.869 81.9065 786.697 65.5368 791.782 45.6797C796.867 65.5367 805.695 81.9066 818.403 94.6152C831.112 107.324 847.481 116.152 867.338 121.237C847.481 126.322 831.112 135.15 818.403 147.858C805.694 160.567 796.867 176.937 791.782 196.795Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="M760.632 764.337C720.719 814.616 669.835 855.1 611.872 882.692C553.91 910.285 490.404 924.255 426.213 923.533C362.022 922.812 298.846 907.419 241.518 878.531C184.19 849.643 134.228 808.026 95.4548 756.863C56.6815 705.7 30.1238 646.346 17.8129 583.343C5.50207 520.339 7.76433 455.354 24.4266 393.359C41.089 331.364 71.7099 274.001 113.947 225.658C156.184 177.315 208.919 139.273 268.117 114.442"
        stroke="currentColor"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Anthropic/Claude icon component
function AnthropicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

export function PageActions() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Don't render in App Router context (router is null there)
  // This component is designed for Pages Router docs pages only
  if (!router) {
    return null;
  }

  // Get the current path, stripping any hash or query params
  const currentPath = router.asPath?.split(/[?#]/)[0] || "";

  // Hide on the main docs index route
  if (currentPath === "/docs" || currentPath === "/docs/") {
    return null;
  }

  // Build the markdown URL that LLMs can fetch
  const markdownUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const pageUrl = `https://www.inngest.com${currentPath}`;
    return pageUrl
  }, [currentPath]);

  // The query to send to LLMs - they will fetch and read the markdown URL
  const llmQuery = useMemo(() => {
    return `Read ${markdownUrl}, I want to ask questions about it.`;
  }, [markdownUrl]);

  // Build LLM provider links with proper URL patterns
  const llmLinks = useMemo(() => {
    return [
      {
        id: "scira",
        name: "Scira AI",
        href: `https://scira.ai/?${new URLSearchParams({ q: llmQuery })}`,
        icon: SciraIcon,
      },
      {
        id: "chatgpt",
        name: "ChatGPT",
        href: `https://chatgpt.com/?${new URLSearchParams({ hints: "search", q: llmQuery })}`,
        icon: RiOpenaiFill,
      },
      {
        id: "claude",
        name: "Claude",
        href: `https://claude.ai/new?${new URLSearchParams({ q: llmQuery })}`,
        icon: AnthropicIcon,
      },
      {
        id: "t3chat",
        name: "T3 Chat",
        href: `https://t3.chat/new?${new URLSearchParams({ q: llmQuery })}`,
        icon: RiChat1Line,
      },
    ];
  }, [llmQuery]);

  // GitHub link to source file
  const githubUrl = useMemo(() => {
    return `https://github.com/inngest/website/blob/main/pages${currentPath}.mdx`;
  }, [currentPath]);

  // Fetch the processed markdown content
  const getMarkdownContent = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(
        `/docs-markdown/${currentPath.replace(/^\/docs/, '')}`
      );
      if (!response.ok) {
        console.error(response);
        return null;
      }
      return await response.text();
    } catch (error) {
      console.error("Failed to fetch markdown:", error);
      return null;
    }
  }, [currentPath]);

  // Copy markdown to clipboard
  const handleCopy = async () => {
    const content = await getMarkdownContent();
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Base button styles to match the design system
  const buttonBase =
    "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50";
  const buttonStyle =
    "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 border border-transparent";

  return (
    <div className="flex items-center gap-2 not-prose">
      <button
        onClick={handleCopy}
        className={clsx(buttonBase, buttonStyle)}
        aria-label="Copy Markdown"
      >
        {copied ? (
          <RiCheckLine className="h-4 w-4" />
        ) : (
          <RiFileCopyLine className="h-4 w-4" />
        )}
        <span>{copied ? "Copied" : "Copy Markdown"}</span>
      </button>

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button className={clsx(buttonBase, buttonStyle)}>
            <span>Open</span>
            <RiArrowDownSLine className="h-4 w-4 text-slate-500" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="z-50 w-56 rounded-md border border-slate-200 bg-white p-1 shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950"
            sideOffset={5}
            align="end"
          >
            <div className="flex flex-col gap-0.5">
              {/* GitHub - direct link */}
              <ActionLink
                icon={RiGithubFill}
                label="Open in GitHub"
                href={githubUrl}
              />

              <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

              {/* LLM providers - pass markdown URL for them to read */}
              {llmLinks.map((link) => (
                <ActionLink
                  key={link.id}
                  icon={link.icon}
                  label={`Open in ${link.name}`}
                  href={link.href}
                />
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

function ActionLink({
  icon: Icon,
  label,
  href,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50"
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      <span className="opacity-50">↗</span>
    </a>
  );
}
