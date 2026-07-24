import { useState } from "react";
import "./agentView.css";

type Props = {
  title: string;   // e.g. "/patterns.md" or "/patterns/flash-sales.md"
  markdown: string;
  mdUrl: string;   // path to the /md API endpoint, e.g. "/patterns/md"
};

function lineClass(line: string): string {
  if (/^#{1,3}\s/.test(line)) return "av-lc--heading";
  if (/^>/.test(line)) return "av-lc--blockquote";
  if (/^(URL|Tags|Sections|Total patterns|title|subtitle|section|url):/.test(line))
    return "av-lc--meta";
  if (/^---/.test(line)) return "av-lc--rule";
  return "";
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 9 V 3 a1.5 1.5 0 0 1 1.5 -1.5 H 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M5.5 8.5 L8.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6.5 4.5 H4.5 a2 2 0 0 0 0 4 H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.5 9.5 H9.5 a2 2 0 0 0 0 -4 H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export default function AgentView({ title, markdown, mdUrl }: Props) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const lines = markdown.split("\n");
  const words = markdown.split(/\s+/).filter(Boolean).length;

  const copy = async (which: "md" | "url") => {
    const text =
      which === "md"
        ? markdown
        : window.location.origin + mdUrl;
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {}
    if (which === "md") {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="av">
      {/* Header */}
      <div className="av-header">
        <p className="av-breadcrumb">AGENT MODE <span className="av-sep">/</span> MARKDOWN SOURCE</p>

        <div className="av-meta-row">
          <h1 className="av-title">{title}</h1>
          <div className="av-stats">
            <span className="av-stat">
              <strong>{lines.length}</strong>
              <small>LINES</small>
            </span>
            <span className="av-stat">
              <strong>{words}</strong>
              <small>WORDS</small>
            </span>
          </div>
        </div>

        <p className="av-desc">
          Raw markdown for LLMs, copilots, and any agent that speaks docs.{" "}
          Stable URL:{" "}
          <a href={mdUrl} className="av-url-link">
            {mdUrl}
          </a>
        </p>

        <div className="av-actions">
          <button
            type="button"
            className="av-btn av-btn--primary"
            onClick={() => copy("md")}
          >
            <CopyIcon />
            {copiedMd ? "Copied!" : "Copy markdown"}
          </button>
          <button
            type="button"
            className="av-btn"
            onClick={() => copy("url")}
          >
            <LinkIcon />
            {copiedUrl ? "Copied!" : "Copy URL"}
          </button>
        </div>
      </div>

      {/* Code viewer */}
      <div className="av-code">
        <div className="av-code-head">
          <span className="av-dots" aria-hidden>
            <span /><span /><span />
          </span>
          <span className="av-code-name">{title}</span>
          <span className="av-code-type">TEXT/MARKDOWN</span>
        </div>
        <pre className="av-pre" aria-label="Markdown source">
          {lines.map((line, i) => (
            <div key={i} className="av-line">
              <span className="av-ln">{String(i + 1).padStart(3, "0")}</span>
              <span className={`av-lc ${lineClass(line)}`}>{line || " "}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
