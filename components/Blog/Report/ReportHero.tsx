import Link from "next/link";
import Logo from "src/shared/Icons/Logo";
import { REPORT_COLUMN_BLEED, REPORT_LOGOS } from "./constants";

type Props = {
  author?: string[];
  date?: string;
  readingTime?: string;
};

export function ReportHero({ author, date, readingTime }: Props = {}) {
  return (
    <div
      className={`${REPORT_COLUMN_BLEED} relative mb-14 overflow-hidden rounded-lg`}
      style={{
        background:
          "linear-gradient(145deg, #FB5536 0%, #e84a2e 35%, #d43d24 70%, #c23520 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "url('/assets/report-assets/report_texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "soft-light",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16 lg:py-20">
        <Link
          href="/"
          className="mb-10 inline-block transition-opacity hover:opacity-70"
          aria-label="Inngest homepage"
        >
          <Logo width={120} fill="#ffffff" />
        </Link>

        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/80">
            Benchmark report · 2026
          </p>
          <h2 className="mt-4 font-whyteInktrap text-4xl font-black leading-[1.05] text-white sm:text-5xl md:text-6xl">
            AI in Production:
            <br />
            The 2026 Benchmark Report
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
            We surveyed 130 backend, full-stack, and AI engineers about what it
            takes to run reliable AI workflows in production—and which
            infrastructure choices actually reduce the burden of reliability.
          </p>
          <p className="mt-4">
            <a
              href="/assets/reports/2026-benchmark/2026-durable-execution-benchmark-report.pdf"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#c23520] transition hover:bg-white/90"
            >
              Download PDF
            </a>
          </p>
        </div>

        <div className="mt-14 border-t border-white/20 pt-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-white/70">
            With participation from engineers at
          </p>
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-8 gap-y-6 sm:grid-cols-5">
            {REPORT_LOGOS.map((logo) => (
              <div
                key={logo.name}
                className={`flex items-center justify-center${logo.name === "Remitly" ? " hidden sm:flex" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{
                    maxHeight: logo.h,
                    maxWidth: "100%",
                    height: "auto",
                    width: "auto",
                    display: "block",
                    filter: "brightness(0) invert(1)",
                    opacity: 0.95,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {(author?.length || date || readingTime) && (
          <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-white/20 pt-8 text-sm text-white/70">
            {author?.map((name, idx) => (
              <span key={name}>
                {name}
                {idx < author.length - 1 ? ", " : ""}
              </span>
            ))}
            {author?.length && date && <span>·</span>}
            {date && <span>{date}</span>}
            {readingTime && (
              <>
                <span>·</span>
                <span>{readingTime}</span>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
