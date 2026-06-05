import { REPORT_FULL_BLEED } from "./constants";

type Finding = {
  number: number;
  title: string;
  body: string;
};

type Props = {
  id?: string;
  intro: string;
  findings: Finding[];
};

export function ReportExecSummary({ id = "executive-summary", intro, findings }: Props) {
  return (
    <div id={id} className={`${REPORT_FULL_BLEED} scroll-mt-28 mb-14`}>
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Sidebar label — mirrors PDF left column */}
        <div
          className="flex items-center justify-center px-6 py-10 md:min-h-[320px] md:py-16"
          style={{
            background:
              "linear-gradient(180deg, #3a3a3a 0%, #212121 50%, #1a1a1a 100%)",
          }}
        >
          <p className="font-whyteInktrap text-2xl font-black uppercase leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
            Executive
            <br />
            Summary
          </p>
        </div>

        {/* Body */}
        <div className="bg-black px-6 py-10 md:px-10 md:py-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[rgb(var(--color-matcha-400))]">
            Executive summary
          </p>
          <p className="mt-4 text-base leading-relaxed text-subtle md:text-lg">
            {intro}
          </p>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            Three key findings
          </p>
          <ol className="mt-6 flex flex-col gap-8">
            {findings.map((finding) => (
              <li key={finding.number} className="flex items-start gap-5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-whyteInktrap text-lg font-bold text-[#0c1f10]"
                  style={{ backgroundColor: "#a8ef3c" }}
                >
                  {finding.number}
                </span>
                <div>
                  <p className="font-semibold text-basis">{finding.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-subtle md:text-base">
                    {finding.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
