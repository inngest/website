"use client";

import { Highlight, type PrismTheme } from "prism-react-renderer";
import V1CodeBlock, {
  type Line,
  type Token,
  type TokenKind,
} from "@/components/v1/sections/shared/CodeBlock";

// Blog-redesign code block. The chrome (gradient frame + fill) and the
// syntax palette are owned by the shared v1 CodeBlock so article code
// reads with the same crisp, high-contrast styling as the marketing
// snippets — instead of the muted flat panel it had before.
//
// That shared component consumes pre-tokenised `Line[]` tuples rather
// than a raw string, so here we run the code through prism-react-
// renderer purely to tokenise it, map each Prism token type onto the
// component's 8-kind `TokenKind` model, and hand off the lines. The
// caret/typewriter are disabled (static article context) and the
// header is hidden — only the gradient frame remains.
//
// Scoped to the v1 /blog/[slug] chrome (mapped as `Code` in this
// route's ArticleBody) so the shared shared/Code/CodeHike component —
// used by the legacy (flag-off) article layout — is untouched.

type CodeBlockData = {
  lang?: string;
  meta?: string;
  value?: string;
  code?: string;
};

// prism-react-renderer's bundled Prism keys grammars by full name;
// normalise the common frontmatter aliases so TS/JS highlight instead
// of falling back to plain text.
const LANG_ALIASES: Record<string, string> = {
  ts: "typescript",
  js: "javascript",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
};

// We only use prism for tokenisation (token `types` + `content`), never
// its colours — the v1 CodeBlock paints from its own palette keyed by
// TokenKind. So the theme passed to <Highlight> can be empty.
const NULL_THEME: PrismTheme = { plain: { color: "" }, styles: [] };

// Collapse prism's fine-grained token types onto the v1 component's
// 8-kind model. Prism hands each token an array of types (most specific
// last); membership tests keep the mapping order-independent.
function mapKind(types: readonly string[]): TokenKind {
  const has = (t: string) => types.includes(t);
  if (has("comment") || has("prolog") || has("cdata") || has("doctype"))
    return "cmt";
  if (
    has("string") ||
    has("char") ||
    has("template-string") ||
    has("attr-value") ||
    has("regex") ||
    has("url")
  )
    return "str";
  if (has("number") || has("boolean") || has("constant") || has("symbol"))
    return "num";
  if (
    has("keyword") ||
    has("control-flow") ||
    has("important") ||
    has("atrule")
  )
    return "kw";
  if (
    has("function") ||
    has("function-variable") ||
    has("method") ||
    has("class-name") ||
    has("maybe-class-name") ||
    has("builtin")
  )
    return "fn";
  if (has("punctuation") || has("operator") || has("entity")) return "punc";
  return "id";
}

export function CodeBlock({ codeblock }: { codeblock: CodeBlockData }) {
  const rawLang = codeblock.lang ?? "";
  const language = LANG_ALIASES[rawLang] ?? rawLang;
  const code = (codeblock.value ?? codeblock.code ?? "").replace(/\n+$/, "");

  return (
    <div className="not-prose my-6">
      <Highlight code={code} language={language as never} theme={NULL_THEME}>
        {({ tokens }) => {
          // Drop a trailing all-empty line (prism appends one for the
          // final newline) so the panel doesn't render a blank row.
          const rows =
            tokens.length > 1 &&
            tokens[tokens.length - 1].every(
              (t) => t.empty || t.content === ""
            )
              ? tokens.slice(0, -1)
              : tokens;

          const lines: Line[] = rows.map((line) =>
            line.map((t) => [t.content, mapKind(t.types)] as Token)
          );

          return (
            <V1CodeBlock
              lines={lines}
              header={false}
              footer={false}
              gutter={false}
              animate={false}
              caret={false}
              fontSize="15px"
              maxWidth="100%"
              maxHeight="none"
            />
          );
        }}
      </Highlight>
    </div>
  );
}
