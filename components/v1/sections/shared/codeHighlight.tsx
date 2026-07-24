import type { ReactNode } from "react";
import { DEFAULT_TOKEN_COLOR, type TokenKind } from "@/components/v1/sections/shared/CodeBlock";

/**
 * Lightweight regex syntax highlighter shared by the bespoke code panels
 * that own their own chrome (CompareTemporal's side-by-side comparison and
 * the "Designed for AI" reel) and therefore can't use the tuple-based
 * `CodeBlock` component directly.
 *
 * The tokenizer classifies into `CodeBlock`'s `TokenKind`s; rendering maps
 * each kind to a colour via the shared palette. Consumers that only want a
 * subset coloured pass a partial palette — unmapped kinds render plain (they
 * inherit the surrounding text colour), so a panel can keep object-keys or
 * numbers uncoloured without forking the tokenizer.
 *
 * NOTE on the punctuation class `[^\s…'"\`]`: quote characters are
 * deliberately excluded so a quote adjacent to other punctuation (e.g.
 * `step.run('x'` or `['x']`) can't be swallowed into a punctuation run —
 * that would desync every following string and bleed the string colour
 * across code.
 */

// Recognised keywords (superset across the consuming panels).
const KEYWORDS = new Set([
  "import", "export", "from", "const", "let", "var", "new", "async",
  "await", "function", "return", "throw", "if", "else", "for", "while",
  "try", "catch", "finally", "typeof", "as", "of", "in", "class",
  "extends", "default",
]);

const TOKEN_RE =
  /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([^\sA-Za-z0-9_$'"`]+)/g;

/** A token: its source text and the `CodeBlock` kind it maps to (or `null`
 *  for punctuation/plain identifiers that inherit the surrounding colour). */
export type HighlightToken = readonly [text: string, kind: TokenKind | null];

/** Tokenize a code string into kind-tagged tokens. */
export function tokenizeCode(code: string): HighlightToken[] {
  const out: HighlightToken[] = [];
  // Tracks whether the previous significant token was the `function`
  // keyword, so the identifier that follows is tagged as a
  // function-declaration name. `matchAll` keeps its own cursor, so there's
  // no shared `lastIndex` state to reset.
  let afterFunction = false;
  for (const m of Array.from(code.matchAll(TOKEN_RE))) {
    const [full, cmt, str, num, ident, ws] = m;
    let kind: TokenKind | null = null;
    if (cmt) kind = "cmt";
    else if (str) kind = "str";
    else if (num) kind = "num";
    else if (ident) {
      if (KEYWORDS.has(ident)) kind = "kw";
      else if (afterFunction) kind = "fn";
      // Identifier immediately followed by a single `:` — an object key or
      // a typed parameter name (CodeBlock's `id` kind).
      else if (/^\s*:(?!:)/.test(code.slice(m.index + full.length)))
        kind = "id";
    }
    if (ident) afterFunction = ident === "function";
    else if (!ws) afterFunction = false;
    out.push([full, kind]);
  }
  return out;
}

/**
 * Render tokens to coloured `<span>`s. `colors` maps a kind → hex; kinds
 * absent from the map render uncoloured (inherit the surrounding colour).
 * Defaults to the full shared palette.
 */
export function renderTokens(
  tokens: HighlightToken[],
  colors: Partial<Record<TokenKind, string>> = DEFAULT_TOKEN_COLOR,
): ReactNode[] {
  return tokens.map(([text, kind], i) => {
    const color = kind ? colors[kind] : undefined;
    return (
      <span key={i} style={color ? { color } : undefined}>
        {text}
      </span>
    );
  });
}
