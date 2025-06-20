"use client";

import { Fragment } from "react";
import { Highlight, themes } from "prism-react-renderer";

import TypeScript from "shared/Icons/TypeScript";
import ReactIcon from "shared/Icons/React";
import Python from "../Icons/Python";

type CodeBlock = {
  lang: string;
  meta: string;
  value?: string;
  code?: string;
};

const languageIcons = {
  typescript: TypeScript,
  python: Python,
  jsx: ReactIcon,
};

export function Code({ codeblock }: { codeblock: CodeBlock }) {
  const lang = codeblock.lang ?? "";
  const { title } = extractFlags(codeblock);

  const codeString = (codeblock.value ?? (codeblock as any).code ?? "").trim();

  const LanguageIcon = (languageIcons as Record<string, any>)[lang];
  const languageBadge = LanguageIcon ? (
    <LanguageIcon size={5} fill="white" className="h-4 w-4" />
  ) : (
    <span className="rounded-sm bg-surfaceBase p-1.5 font-mono text-xs">
      {lang}
    </span>
  );

  return (
    <div className="not-prose relative overflow-hidden rounded-md border border-subtle text-sm">
      {title ? (
        <div className="flex flex-row items-center justify-between border-b border-subtle bg-stone-900 px-4 py-3">
          <div>{title}</div>
          {languageBadge}
        </div>
      ) : (
        <div className="absolute right-2 top-2">{languageBadge}</div>
      )}

      <Highlight
        code={codeString}
        language={lang as any}
        theme={themes.gruvboxMaterialDark}
      >
        {({ className, tokens, getTokenProps }) => (
          <pre
            className={
              "bg-stone-800 " +
              className +
              " flex overflow-x-auto pt-3 font-mono text-sm leading-[1.625]"
            }
          >
            <code className="flex-1 px-6 py-1">
              {tokens.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {line
                    .filter((token) => !token.empty)
                    .map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  {"\n"}
                </Fragment>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export function extractFlags(codeblock: Pick<CodeBlock, "meta">) {
  const flags =
    codeblock.meta?.split(" ").filter((flag) => flag.startsWith("-"))[0] ?? "";
  const title =
    codeblock.meta === flags
      ? ""
      : (codeblock.meta || "").replace(" " + flags, "").trim();
  return { title, flags: flags.slice(1).split("") };
}
