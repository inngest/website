import type { ReactNode } from "react";
import clsx from "clsx";
import {
  GRADIENT_DIVIDER_FILL,
  GRADIENT_RING_FILL,
} from "@/utils/v1/gradientRing";

// Blog article code block. It renders static HTML on the server: no
// client Prism, no typewriter state, and no hydration for every snippet.

// Code Hike annotations. remarkCodeHike/recmaCodeHike resolve these on the
// codeblock prop, independent of any registered runtime handler.
// - Block (`// !diff +`, `// !focus(1:3)`, `// !mark(1:2)`): 1-based line range.
// - Inline (`// !mark[/regex/]`): 1-based, inclusive column range on one line.
type BlockAnnotation = {
  name: string;
  query?: string;
  fromLineNumber: number;
  toLineNumber: number;
};

type InlineAnnotation = {
  name: string;
  query?: string;
  lineNumber: number;
  fromColumn: number;
  toColumn: number;
};

type CodeBlockData = {
  lang?: string;
  meta?: string;
  value?: string;
  code?: string;
  annotations?: Array<Partial<BlockAnnotation & InlineAnnotation>>;
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
  // Prefer `code` (annotation comments stripped) over `value` (raw, keeps the
  // `// !diff`/`// !focus`/`// !mark` comment lines) so line numbers align with
  // the parsed annotations and the markers don't render literally. They're
  // identical for blocks without annotations.
  if (codeblock?.code || codeblock?.value) {
    return (codeblock.code ?? codeblock.value ?? "").replace(/\n+$/, "");
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

  // Consume Code Hike annotations layered onto our custom renderer.
  const allAnnotations = codeblock?.annotations ?? [];
  const blockAnnotations = allAnnotations.filter(
    (a): a is BlockAnnotation =>
      typeof a?.fromLineNumber === "number" &&
      typeof a?.toLineNumber === "number" &&
      typeof a?.name === "string"
  );
  const hasFocus = blockAnnotations.some((a) => a.name === "focus");
  const hasDiff = blockAnnotations.some((a) => a.name === "diff");

  // Inline `// !mark[/regex/]` — 1-based inclusive column ranges, keyed by line.
  const inlineMarks = new Map<number, Array<[number, number]>>();
  for (const a of allAnnotations) {
    if (
      a?.name === "mark" &&
      typeof a?.lineNumber === "number" &&
      typeof a?.fromColumn === "number" &&
      typeof a?.toColumn === "number"
    ) {
      const ranges = inlineMarks.get(a.lineNumber) ?? [];
      ranges.push([a.fromColumn, a.toColumn]);
      inlineMarks.set(a.lineNumber, ranges);
    }
  }

  const lineInfo = (lineNumber: number) => {
    let diff: "+" | "-" | null = null;
    let marked = false;
    let focused = false;
    for (const a of blockAnnotations) {
      if (lineNumber < a.fromLineNumber || lineNumber > a.toLineNumber)
        continue;
      if (a.name === "diff") diff = a.query === "-" ? "-" : "+";
      else if (a.name === "mark") marked = true;
      else if (a.name === "focus") focused = true;
    }
    // With a focus annotation present, everything outside it is dimmed.
    return { diff, marked, dimmed: hasFocus && !focused };
  };

  // Render a line's tokens, wrapping any inline-marked column ranges in a
  // highlight span. Columns are 1-based inclusive; falls back to plain token
  // spans when the line has no inline marks.
  const renderTokens = (line: Line, ranges?: Array<[number, number]>) => {
    if (!line.length) return " ";
    if (!ranges?.length) {
      return line.map(([text, kind], i) => (
        <span key={i} style={{ color: DEFAULT_TOKEN_COLOR[kind] }}>
          {text}
        </span>
      ));
    }
    const isMarked = (col: number) =>
      ranges.some(([from, to]) => col >= from && col <= to);
    const spans: ReactNode[] = [];
    let col = 1;
    let buf = "";
    let bufColor = "";
    let bufMarked = false;
    let key = 0;
    const flush = () => {
      if (!buf) return;
      spans.push(
        <span
          key={key++}
          className={bufMarked ? "rounded bg-v1-frost/20" : undefined}
          style={{ color: bufColor }}
        >
          {buf}
        </span>
      );
      buf = "";
    };
    for (const [text, kind] of line) {
      const color = DEFAULT_TOKEN_COLOR[kind];
      for (let i = 0; i < text.length; i++) {
        const isMark = isMarked(col);
        if (buf && (color !== bufColor || isMark !== bufMarked)) flush();
        bufColor = color;
        bufMarked = isMark;
        buf += text[i];
        col++;
      }
    }
    flush();
    return spans;
  };

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
              {lines.map((line, lineIndex) => {
                const { diff, marked, dimmed } = lineInfo(lineIndex + 1);
                return (
                  <div
                    key={lineIndex}
                    // Net-zero horizontal offset lets diff/mark backgrounds
                    // bleed to the container edges (px-[22px]) without shifting
                    // token alignment between annotated and plain lines.
                    className={clsx(
                      "-mx-[22px] px-[22px]",
                      diff === "+" && "bg-v1-accent-green/10",
                      diff === "-" && "bg-v1-accent-salmon/10",
                      marked && !diff && "bg-v1-frost/10",
                      dimmed && "opacity-40"
                    )}
                  >
                    {hasDiff && (
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "mr-3 inline-block w-2 select-none text-right",
                          diff === "+" && "text-v1-accent-green",
                          diff === "-" && "text-v1-accent-salmon-dark"
                        )}
                      >
                        {diff ?? " "}
                      </span>
                    )}
                    {renderTokens(line, inlineMarks.get(lineIndex + 1))}
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
