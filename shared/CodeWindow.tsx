"use client"; // Required for app router server components
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

export const removeLeadingSpaces = (snippet: string): string => {
  const lines = snippet.split("\n");
  if (!lines[0]?.replace(/^\s+/, "").length) {
    lines.shift();
  }
  if (!lines[lines.length - 1]?.replace(/^\s+/, "").length) {
    lines.pop();
  }
  const leadingSpace = lines[0]?.match(/^\s+/)?.[0];
  return lines.map((l) => l.replace(leadingSpace, "")).join("\n");
};

const colors = {
  slate300: "rgb(203, 213, 225)",
  slate500: "rgb(140, 149, 159)",
  fuchsia300: "rgb(240, 171, 252)",
  amber300: "rgb(252, 211, 77)",
  amber400: "rgb(251, 191, 36)",
  sky300: "rgb(125, 211, 252)",
  emerald300: "rgb(110, 231, 183)",
  // New colors 2024
  green: "#14b8ac",
  orange: "#D97706",
  blue: "#21AFFF",
  carbon500: "#7c7c7c",
  purplehaze300: "#8B74F9",
};

const theme = {
  ...gruvboxDark,
  // "hljs-keyword": { color: colors.green },
  // "hljs-attr": { color: colors.orange },
  // "hljs-string": { color: colors.blue },
  // "hljs-number": { color: "rgb(var(--color-quaternary-cool-xIntense))" },
  // "hljs-comment": { color: colors.carbon500 },
};

const CodeWindow = ({
  snippet,
  className = "",
  style = {},
  header,
  showLineNumbers = false,
  lineHighlights = [],
}: {
  snippet: string;
  className?: string;
  style?: object;
  header?: React.ReactNode;
  showLineNumbers?: boolean;
  lineHighlights?: [number, number][];
}) => {
  return (
    <div
      className={`border border-subtle bg-stone-800 text-sm leading-relaxed ${className}`}
      style={style}
    >
      {header && <div className="mb-1 bg-canvasSubtle px-2">{header}</div>}
      <div className="flex flex-row items-stretch p-2">
        {Boolean(lineHighlights?.length) && (
          <div className="relative h-full w-[2px] py-1">
            {/* leading-relaxed is 1.625 */}
            {lineHighlights.map(([highlightStart, highlightEnd]) => {
              return (
                <span
                  className="absolute border-r-2 border-slate-200/50"
                  style={{
                    top: `${(highlightStart - 1) * 1.625 + 0.25 + 0.05}em`, // 0.25 to match top padding + extra nudge
                    height: `${(highlightEnd - highlightStart + 1) * 1.625}em`,
                  }}
                />
              );
            })}
          </div>
        )}
        <SyntaxHighlighter
          language="javascript"
          showLineNumbers={showLineNumbers}
          lineNumberContainerStyle={{
            borderRight: "1px solid pink",
            background: "pink",
          }}
          lineNumberStyle={{
            minWidth: "3em",
            color: "rgb(var(--color-canvas-base))",
          }}
          style={theme}
          customStyle={{
            padding: "0.25rem",
            color: "rgb(var(--color-foreground-base))",
            background: "transparent",
          }}
          className="!overflow-hidden"
        >
          {removeLeadingSpaces(snippet)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeWindow;
