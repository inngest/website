import { useMemo } from "react";

// ─── Inline markdown ─────────────────────────────────────────────────────────
type InlineNode = string | React.ReactElement;

function parseInline(text: string, key = "i"): InlineNode[] {
  if (!text) return [];
  const out: InlineNode[] = [];
  let buf = "";
  let i = 0;
  let n = 0;
  const push = (el: React.ReactElement) => {
    if (buf) { out.push(buf); buf = ""; }
    out.push(el);
  };
  while (i < text.length) {
    const ch = text[i];

    if (ch === "`") {
      const end = text.indexOf("`", i + 1);
      if (end !== -1) {
        push(<code key={`${key}-c${n++}`} className="md-inline-code">{text.slice(i + 1, end)}</code>);
        i = end + 1;
        continue;
      }
    }

    if (ch === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        push(<strong key={`${key}-b${n++}`}>{parseInline(text.slice(i + 2, end), `${key}-b${n}`)}</strong>);
        i = end + 2;
        continue;
      }
    }

    if (ch === "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1 && text[i + 1] !== " ") {
        push(<em key={`${key}-e${n++}`}>{parseInline(text.slice(i + 1, end), `${key}-e${n}`)}</em>);
        i = end + 1;
        continue;
      }
    }

    if (ch === "[") {
      const close = text.indexOf("]", i + 1);
      if (close !== -1 && text[close + 1] === "(") {
        const urlEnd = text.indexOf(")", close + 2);
        if (urlEnd !== -1) {
          const linkText = text.slice(i + 1, close);
          const url = text.slice(close + 2, urlEnd);
          const isInternal = url.startsWith("/");
          push(
            <a
              key={`${key}-l${n++}`}
              href={url}
              className="md-link"
              target={isInternal ? "_self" : "_blank"}
              rel={isInternal ? undefined : "noopener noreferrer"}
            >
              {parseInline(linkText, `${key}-l${n}`)}
            </a>
          );
          i = urlEnd + 1;
          continue;
        }
      }
    }

    buf += ch;
    i++;
  }
  if (buf) out.push(buf);
  return out;
}

// ─── Block parser ─────────────────────────────────────────────────────────────
type Block =
  | { type: "heading"; level: 1 | 2 | 3; value: string }
  | { type: "p"; value: string }
  | { type: "hr" }
  | { type: "blockquote"; value: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "code"; lang: string; value: string };

const RE = {
  heading: /^(#{1,3})\s+(.*)$/,
  fence: /^```(\w*)\s*$/,
  hr: /^---+\s*$/,
  ul: /^\s*[-*]\s+(.*)$/,
  ol: /^\s*\d+\.\s+(.*)$/,
  blockquote: /^>\s?(.*)$/,
  tableRow: /^\|(.+)\|\s*$/,
  tableDelim: /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/,
};

function blockParse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    let m = RE.fence.exec(line);
    if (m) {
      const lang = m[1] || "";
      const code: string[] = [];
      i++;
      while (i < lines.length && !RE.fence.exec(lines[i])) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", lang, value: code.join("\n") });
      continue;
    }

    m = RE.heading.exec(line);
    if (m) {
      blocks.push({ type: "heading", level: m[1].length as 1 | 2 | 3, value: m[2] });
      i++;
      continue;
    }

    if (RE.hr.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    if (RE.tableRow.test(line) && i + 1 < lines.length && RE.tableDelim.test(lines[i + 1])) {
      const headerCells = line.slice(1, -1).split("|").map((c) => c.trim());
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && RE.tableRow.test(lines[i])) {
        rows.push(lines[i].slice(1, -1).split("|").map((c) => c.trim()));
        i++;
      }
      blocks.push({ type: "table", header: headerCells, rows });
      continue;
    }

    if (RE.ul.test(line)) {
      const items: string[] = [];
      while (i < lines.length && RE.ul.test(lines[i])) {
        items.push(RE.ul.exec(lines[i])![1]);
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (RE.ol.test(line)) {
      const items: string[] = [];
      while (i < lines.length && RE.ol.test(lines[i])) {
        items.push(RE.ol.exec(lines[i])![1]);
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    m = RE.blockquote.exec(line);
    if (m) {
      const buf = [m[1]];
      i++;
      while (i < lines.length && RE.blockquote.test(lines[i])) {
        buf.push(RE.blockquote.exec(lines[i])![1]);
        i++;
      }
      blocks.push({ type: "blockquote", value: buf.join(" ") });
      continue;
    }

    const para = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !RE.heading.exec(lines[i]) &&
      !RE.fence.exec(lines[i]) &&
      !RE.hr.test(lines[i]) &&
      !RE.ul.test(lines[i]) &&
      !RE.ol.test(lines[i]) &&
      !RE.blockquote.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", value: para.join(" ") });
  }
  return blocks;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Syntax highlighter (TS/TSX/JS subset) ───────────────────────────────────
const KEYWORDS = new Set([
  "import", "from", "export", "const", "let", "var", "function", "return",
  "async", "await", "if", "else", "for", "while", "switch", "case",
  "break", "continue", "default", "true", "false", "null", "undefined",
  "new", "this", "class", "extends", "implements", "interface", "type",
  "as", "in", "of", "try", "catch", "finally", "throw",
]);

type Token = { text: string; cls: string };

function highlightLine(line: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const n = line.length;
  while (i < n) {
    const ch = line[i];

    if (ch === "/" && line[i + 1] === "/") {
      out.push({ text: line.slice(i), cls: "tok-comment" });
      break;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < n && line[j] !== quote) {
        if (line[j] === "\\") j++;
        j++;
      }
      out.push({ text: line.slice(i, j + 1), cls: "tok-string" });
      i = j + 1;
      continue;
    }

    if (/\d/.test(ch)) {
      let j = i;
      while (j < n && /[\d.\-_]/.test(line[j])) j++;
      out.push({ text: line.slice(i, j), cls: "tok-number" });
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[\w$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let cls = "tok-id";
      if (KEYWORDS.has(word)) cls = "tok-keyword";
      else if (/^[A-Z]/.test(word)) cls = "tok-type";
      else if (line[j] === "(") cls = "tok-fn";
      out.push({ text: word, cls });
      i = j;
      continue;
    }

    let j = i;
    while (j < n && !/[A-Za-z_$0-9"'`/]/.test(line[j]) && j < i + 4) {
      if (j > i && /[\w$"'`]/.test(line[j])) break;
      j++;
    }
    if (j === i) j = i + 1;
    out.push({ text: line.slice(i, j), cls: "tok-punct" });
    i = j;
  }
  return out;
}

function CodeBlock({ value, lang }: { value: string; lang: string }) {
  const lines = value.split("\n");
  const useHighlight =
    !lang || ["ts", "tsx", "typescript", "js", "jsx", "javascript"].includes(lang);
  return (
    <div className="md-code-block">
      <div className="md-code-block-head">
        <span className="md-code-block-lang">{lang || "ts"}</span>
        <button
          type="button"
          className="md-code-block-copy"
          onClick={async () => {
            try { await navigator.clipboard.writeText(value); } catch (_) {}
          }}
        >
          <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M2 9 V 3 a1.5 1.5 0 0 1 1.5 -1.5 H 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          <span>Copy</span>
        </button>
      </div>
      <pre className="md-code-block-pre">
        <code>
          {lines.map((line, idx) => (
            <div key={idx} className="md-code-line">
              <span className="md-code-num">{String(idx + 1).padStart(2, "0")}</span>
              <span className="md-code-text">
                {useHighlight
                  ? highlightLine(line).map((t, j) => (
                      <span key={j} className={t.cls}>{t.text}</span>
                    ))
                  : line || " "}
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

// ─── Public renderer + headings extractor ────────────────────────────────────
export function MarkdownRender({ source }: { source: string }) {
  const blocks = useMemo(() => blockParse(source), [source]);

  return (
    <div className="md-prose">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading": {
            const id = slugify(b.value);
            if (b.level === 1)
              return <h1 key={i} id={id} className="md-h1">{parseInline(b.value, `h1-${i}`)}</h1>;
            if (b.level === 2)
              return (
                <h2 key={i} id={id} className="md-h2">
                  <a href={`#${id}`} className="md-anchor" aria-label="Anchor">§</a>
                  {parseInline(b.value, `h2-${i}`)}
                </h2>
              );
            return <h3 key={i} id={id} className="md-h3">{parseInline(b.value, `h3-${i}`)}</h3>;
          }
          case "p":
            return <p key={i} className="md-p">{parseInline(b.value, `p-${i}`)}</p>;
          case "hr":
            return <hr key={i} className="md-hr" />;
          case "blockquote":
            return <blockquote key={i} className="md-blockquote">{parseInline(b.value, `q-${i}`)}</blockquote>;
          case "ul":
            return (
              <ul key={i} className="md-ul">
                {b.items.map((it, j) => <li key={j}>{parseInline(it, `ul-${i}-${j}`)}</li>)}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="md-ol">
                {b.items.map((it, j) => <li key={j}>{parseInline(it, `ol-${i}-${j}`)}</li>)}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="md-table-wrap">
                <table className="md-table">
                  <thead>
                    <tr>{b.header.map((c, k) => <th key={k}>{parseInline(c, `th-${i}-${k}`)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>{r.map((c, k) => <td key={k}>{parseInline(c, `td-${i}-${j}-${k}`)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return <CodeBlock key={i} value={b.value} lang={b.lang} />;
        }
      })}
    </div>
  );
}

export function extractMdHeadings(source: string) {
  const blocks = blockParse(source);
  return blocks
    .filter((b): b is Block & { type: "heading" } => b.type === "heading" && b.level === 2)
    .map((b) => ({ title: b.value, slug: slugify(b.value) }));
}
