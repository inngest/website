"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React from "react";

// Simple bash snippet shown inside the terminal.
const TERMINAL_SNIPPET = `\n$ npx --ignore-scripts=false inngest-cli dev\n\nInngest dev server running...`;

export default function Terminal() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        "npx --ignore-scripts=false inngest-cli dev"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="terminal flex flex-col md:my-20">
      <h2 className="md:font-sm mx-auto mb-1 font-circular text-xs font-light">
        ONE-COMMAND SETUP
      </h2>
      <div className="terminal-anchor relative z-30 mx-auto w-full max-w-[406px] overflow-hidden border-2 border-stone-700 bg-stone-900 text-sm shadow-lg">
        {/* Header with traffic lights and copy button */}
        <div className="flex h-9 items-center justify-between border-b-2 border-stone-700 px-4">
          {/* Faux traffic lights */}
          <div className="flex space-x-2">
            <span className="h-3 w-3 rounded-full border border-stone-700" />
            <span className="h-3 w-3 rounded-full border border-stone-700" />
            <span className="h-3 w-3 rounded-full border border-stone-700" />
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 border border-stone-700 px-2 py-1 font-mono text-xs text-stone-300 transition-opacity hover:opacity-80"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            {copied ? "Copied" : "Copy command"}
          </button>
        </div>

        {/* Terminal content */}
        <Highlight
          code={TERMINAL_SNIPPET.trim()}
          language="bash"
          theme={themes.gruvboxMaterialDark}
        >
          {({ className, tokens, getTokenProps }) => (
            <pre className={`bg-stone-800 ${className} p-4 text-sm`}>
              <code className="leading-[1.625]">
                {tokens.map((line, lineIndex) => (
                  <React.Fragment key={lineIndex}>
                    {line
                      .filter((token) => !token.empty)
                      .map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    {"\n"}
                  </React.Fragment>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
