import type { ReactNode } from "react";
import styles from "./ProductSection.module.css";

type Product = "workflow" | "sandbox" | "evals" | "experiments";

const captions: Record<Product, string> = {
  workflow: "Saved steps stay complete. Only the failed step retries.",
  sandbox:
    "The script runs out of memory inside the Sandbox. Your app keeps running.",
  evals: "Later feedback links back to the original run.",
  experiments: "Compare outcome scores for each variant. Illustrative data.",
};

function Box({
  x,
  y,
  width = 88,
  label,
}: {
  x: number;
  y: number;
  width?: number;
  label: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="42"
        rx="8"
        className={styles.box}
      />
      <text x={x + width / 2} y={y + 25} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Visual({ kind }: { kind: Product }) {
  switch (kind) {
    case "workflow":
      return (
        <>
          <path d="M66 94H274" className={styles.line} />
          <Box x={16} y={73} label="Draft reply" />
          <Box x={126} y={73} label="Send reply" />
          <Box x={236} y={73} label="Close ticket" />
          <text x="60" y="139" textAnchor="middle" className={styles.success}>
            ✓ Saved
          </text>
          <g className={styles.failure}>
            <rect
              x="126"
              y="73"
              width="88"
              height="42"
              rx="8"
              className={styles.failedBox}
            />
            <text x="170" y="98" textAnchor="middle">
              Send failed
            </text>
            <text x="170" y="139" textAnchor="middle">
              ↻ Retrying
            </text>
          </g>
          <g className={styles.recovered}>
            <rect
              x="126"
              y="73"
              width="88"
              height="42"
              rx="8"
              className={styles.completeBox}
            />
            <text x="170" y="98" textAnchor="middle">
              Send reply
            </text>
            <text
              x="170"
              y="139"
              textAnchor="middle"
              className={styles.success}
            >
              ✓ Sent
            </text>
          </g>
          <text
            x="280"
            y="139"
            textAnchor="middle"
            className={`${styles.last} ${styles.success}`}
          >
            ✓ Closed
          </text>
          <text x="170" y="38" textAnchor="middle" className={styles.muted}>
            One workflow · three steps
          </text>
        </>
      );
    case "sandbox":
      return (
        <>
          <rect
            x="24"
            y="25"
            width="292"
            height="145"
            rx="12"
            className={styles.boundary}
          />
          <text x="42" y="48" className={styles.success}>
            Isolated microVM
          </text>
          <Box x={46} y={64} width={248} label="$ python generated_script.py" />
          <text x="48" y="132" className={styles.sandboxRunning}>
            Running generated code…
          </text>
          <g className={styles.sandboxCrash}>
            <text x="48" y="132" className={styles.error}>
              ✕ Crashed: out of memory
            </text>
            <text x="48" y="154" className={styles.muted}>
              Process exited · contained in microVM
            </text>
          </g>
          <rect
            x="65"
            y="184"
            width="210"
            height="34"
            rx="8"
            className={styles.completeBox}
          />
          <text x="170" y="205" textAnchor="middle" className={styles.success}>
            ✓ Your app · Still running
          </text>
        </>
      );
    case "evals":
      return (
        <>
          <Box x={24} y={38} width={130} label="Run #42 · answer" />
          <path d="M89 80V157H186" className={styles.line} />
          <text x="106" y="112" className={styles.muted}>
            Days later…
          </text>
          <g className={styles.recovered}>
            <Box x={186} y={136} width={130} label="Customer rating" />
            <text
              x="250"
              y="199"
              textAnchor="middle"
              className={styles.success}
            >
              Helpful: yes → Run #42
            </text>
          </g>
        </>
      );
    case "experiments":
      return (
        <>
          <text x="24" y="37" className={styles.muted}>
            Example · helpful answers
          </text>
          <text x="24" y="83">
            Prompt A
          </text>
          <text x="24" y="139">
            Prompt B
          </text>
          <rect
            x="102"
            y="65"
            width="170"
            height="26"
            rx="4"
            className={styles.track}
          />
          <rect
            x="102"
            y="121"
            width="170"
            height="26"
            rx="4"
            className={styles.track}
          />
          <rect
            x="102"
            y="65"
            width="112"
            height="26"
            rx="4"
            className={`${styles.bar} ${styles.barA}`}
          />
          <rect
            x="102"
            y="121"
            width="143"
            height="26"
            rx="4"
            className={styles.bar}
          />
          <text x="286" y="83">
            66%
          </text>
          <text x="286" y="139">
            84%
          </text>
          <text x="170" y="193" textAnchor="middle" className={styles.muted}>
            Each score credits the variant that ran
          </text>
        </>
      );
  }
}

// Keep headings, explanations and links in MDX children for markdown consumers.
export function ProductSection({
  kind,
  children,
}: {
  kind: Product;
  children: ReactNode;
}) {
  return (
    <section className="my-10 grid items-center gap-6 border-t border-subtle pt-8 lg:grid-cols-2">
      <div className="[&>h2:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
      <figure
        className={`not-prose m-0 overflow-hidden rounded-xl border border-subtle bg-surfaceSubtle ${styles.visual}`}
      >
        <div aria-hidden="true">
          <svg
            viewBox="0 0 340 230"
            className="w-full text-basis"
            focusable="false"
          >
            <Visual kind={kind} />
          </svg>
        </div>
        <figcaption className="border-t border-subtle bg-canvasBase p-4 text-xs leading-relaxed text-subtle">
          {captions[kind]}
        </figcaption>
      </figure>
    </section>
  );
}
