import type { ReactNode } from "react";
import {
  GRADIENT_DIVIDER_FILL,
  GRADIENT_RING_FILL,
} from "@/utils/v1/gradientRing";

// Blog article code block. It renders static HTML on the server: no
// client Prism, no typewriter state, and no hydration for every snippet.

type CodeBlockData = {
  lang?: string;
  meta?: string;
  value?: string;
  code?: string;
};

type TokenKind = "kw" | "fn" | "id" | "var" | "str" | "num" | "punc" | "cmt";
type Token = readonly [string, TokenKind];
type Line = readonly Token[];

const LANG_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
};

const DEFAULT_TOKEN_COLOR: Record<TokenKind, string> = {
  kw: "#c586c0",
  fn: "#dcdcaa",
  id: "#9cdcfe",
  var: "#4fc1ff",
  str: "#ce9178",
  num: "#b5cea8",
  punc: "#d4d4d4",
  cmt: "#6a9955",
};

const KEYWORDS = new Set([
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "def",
  "default",
  "do",
  "else",
  "export",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "interface",
  "let",
  "new",
  "null",
  "return",
  "switch",
  "throw",
  "true",
  "try",
  "type",
  "undefined",
  "var",
  "while",
  "yield",
]);

const FRAME_GRADIENT = GRADIENT_RING_FILL;
const FILL_GRADIENT =
  "linear-gradient(297deg, rgb(var(--color-v1-carbon-400) / 0.59) -2.25%, rgb(var(--color-v1-carbon-500)) 46.83%)";

function getCodeText(codeblock?: CodeBlockData, children?: ReactNode): string {
  if (codeblock?.value || codeblock?.code) {
    return (codeblock.value ?? codeblock.code ?? "").replace(/\n+$/, "");
  }
  if (typeof children === "string") return children.replace(/\n+$/, "");
  if (Array.isArray(children)) {
    return children
      .map((child) => (typeof child === "string" ? child : ""))
      .join("")
      .replace(/\n+$/, "");
  }
  return "";
}

function pushToken(tokens: Token[], text: string, kind: TokenKind) {
  if (!text) return;
  const last = tokens[tokens.length - 1];
  if (last?.[1] === kind) {
    tokens[tokens.length - 1] = [last[0] + text, kind];
  } else {
    tokens.push([text, kind]);
  }
}

function scanString(line: string, start: number): number {
  const quote = line[start];
  let i = start + 1;
  while (i < line.length) {
    if (line[i] === "\\") {
      i += 2;
      continue;
    }
    if (line[i] === quote) return i + 1;
    i++;
  }
  return line.length;
}

function tokenizeLine(line: string, language: string): Line {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const next = line[i + 1];

    if (
      (char === "/" && next === "/" && language !== "python") ||
      (char === "#" && language !== "tsx" && language !== "typescript")
    ) {
      pushToken(tokens, line.slice(i), "cmt");
      break;
    }

    if (char === '"' || char === "'" || char === "`") {
      const end = scanString(line, i);
      pushToken(tokens, line.slice(i, end), "str");
      i = end;
      continue;
    }

    const number = line.slice(i).match(/^\d+(?:\.\d+)?/);
    if (number) {
      pushToken(tokens, number[0], "num");
      i += number[0].length;
      continue;
    }

    const word = line.slice(i).match(/^[A-Za-z_$][\w$-]*/);
    if (word) {
      const value = word[0];
      const after = line.slice(i + value.length).trimStart();
      pushToken(
        tokens,
        value,
        KEYWORDS.has(value) ? "kw" : after.startsWith("(") ? "fn" : "id"
      );
      i += value.length;
      continue;
    }

    pushToken(
      tokens,
      char,
      /[{}[\]().,;:<>/+*=|&!?-]/.test(char) ? "punc" : "id"
    );
    i++;
  }

  return tokens;
}

export function CodeBlock({
  codeblock,
  children,
}: {
  codeblock?: CodeBlockData;
  children?: ReactNode;
}) {
  const rawLang = codeblock?.lang ?? "";
  const language = LANG_ALIASES[rawLang] ?? rawLang;
  const code = getCodeText(codeblock, children);
  const lines = (code || " ")
    .split("\n")
    .map((line) => tokenizeLine(line, language));

  return (
    <div className="not-prose my-6">
      <div
        className="flex w-full min-w-0 flex-1 overflow-hidden rounded-md p-[1px]"
        style={{
          background: FRAME_GRADIENT,
          maxWidth: "100%",
          maxHeight: "none",
        }}
      >
        <div
          className="flex w-full flex-col overflow-hidden rounded-md bg-v1-surfaceBase"
          style={{ backgroundImage: FILL_GRADIENT }}
        >
          <div
            aria-hidden="true"
            className="h-px shrink-0"
            style={{ background: GRADIENT_DIVIDER_FILL }}
          />
          <div className="flex min-h-0 w-full flex-1 items-start overflow-y-auto bg-v1-surfaceBase px-[22px] py-4 lg:overflow-visible">
            <pre
              className="min-w-0 flex-1 whitespace-pre-wrap break-words font-v1Mono leading-[1.55] text-v1-frost"
              style={{ fontSize: "15px" }}
            >
              {lines.map((line, lineIndex) => (
                <div key={lineIndex}>
                  {line.length
                    ? line.map(([text, kind], tokenIndex) => (
                        <span
                          key={tokenIndex}
                          style={{ color: DEFAULT_TOKEN_COLOR[kind] }}
                        >
                          {text}
                        </span>
                      ))
                    : " "}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
