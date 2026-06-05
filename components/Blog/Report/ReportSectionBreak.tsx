import Image from "next/image";
import { REPORT_FULL_BLEED, REPORT_SHAPE, REPORT_TEXTURE } from "./constants";

type Stat = {
  value: string;
  label: string;
};

type StatGroup = {
  intro: string;
  stats: Stat[];
};

type Props = {
  id: string;
  section: number;
  title: string;
  /** Lead-in copy before headline stats (section 5 in the PDF). */
  intro?: string;
  /** Single headline stats (sections 1–3, 5–6). */
  stats?: Stat[];
  /** Paired comparison blocks (section 4 in the PDF). */
  statGroups?: StatGroup[];
  variant?: "green" | "orange" | "blue";
};

const VARIANTS = {
  green: {
    background:
      "linear-gradient(135deg, #2C9B63 0%, #79D617 22%, #a8ef3c 50%, #79D617 78%, #2C9B63 100%)",
    text: "#0c1f10",
    divider: "rgba(12, 31, 16, 0.25)",
    label: "rgba(12, 31, 16, 0.65)",
  },
  orange: {
    background:
      "linear-gradient(145deg, #FB5536 0%, #e84a2e 50%, #d43d24 100%)",
    text: "#ffffff",
    divider: "rgba(255, 255, 255, 0.25)",
    label: "rgba(255, 255, 255, 0.85)",
  },
  blue: {
    background:
      "linear-gradient(135deg, #0b44bd 0%, #1364D6 38%, #1e73cf 68%, #2d7ede 100%)",
    text: "#ffffff",
    divider: "rgba(255, 255, 255, 0.3)",
    label: "rgba(255, 255, 255, 0.92)",
  },
} as const;

export function ReportSectionBreak({
  id,
  section,
  title,
  intro,
  stats = [],
  statGroups,
  variant = "green",
}: Props) {
  const theme = VARIANTS[variant];

  return (
    <div
      id={id}
      className={`${REPORT_FULL_BLEED} relative my-14 scroll-mt-28 overflow-hidden rounded-lg`}
      style={{ background: theme.background }}
    >
      <Image
        src={REPORT_SHAPE}
        alt=""
        aria-hidden
        fill
        sizes="(min-width: 1280px) 900px, 100vw"
        quality={75}
        className="pointer-events-none object-contain object-left-top opacity-[0.08]"
      />
      {variant === "blue" && (
        <Image
          src={REPORT_TEXTURE}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 900px, 100vw"
          quality={75}
          className="pointer-events-none object-cover opacity-[0.12] mix-blend-soft-light"
        />
      )}

      <div className="relative mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
        <p
          className="font-mono text-xs uppercase tracking-[0.25em]"
          style={{ color: theme.label }}
        >
          Section {section}
        </p>
        <h2
          className="mt-3 max-w-4xl font-whyteInktrap text-3xl font-black uppercase leading-tight tracking-tight md:text-4xl lg:text-5xl"
          style={{ color: theme.text }}
        >
          {title}
        </h2>

        <div
          className="my-8 h-px w-full max-w-2xl"
          style={{ backgroundColor: theme.divider }}
        />

        {statGroups ? (
          <div className="flex max-w-4xl flex-col gap-10">
            {statGroups.map((group, i) => (
              <div key={i}>
                {i > 0 && (
                  <div
                    className="mb-10 h-px w-full max-w-xl"
                    style={{ backgroundColor: theme.divider }}
                  />
                )}
                <p
                  className="max-w-3xl border-l-2 pl-4 text-base leading-relaxed underline decoration-1 underline-offset-4 md:text-lg"
                  style={{
                    color: theme.text,
                    borderColor: theme.divider,
                  }}
                >
                  {group.intro}
                </p>
                <div className="mt-6 grid gap-8 sm:grid-cols-2">
                  {group.stats.map((stat, j) => (
                    <div key={j}>
                      <p
                        className="font-whyteInktrap text-6xl font-black leading-none md:text-7xl"
                        style={{ color: theme.text }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="mt-2 text-base leading-relaxed md:text-lg"
                        style={{ color: theme.label }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex max-w-3xl flex-col gap-8">
            {intro && (
              <p
                className="max-w-3xl text-base leading-relaxed md:text-lg"
                style={{ color: theme.label }}
              >
                {intro}
              </p>
            )}
            {stats.map((stat, i) => (
              <div key={i}>
                {i > 0 && (
                  <div
                    className="mb-8 h-px w-full max-w-xl"
                    style={{ backgroundColor: theme.divider }}
                  />
                )}
                <p
                  className="font-whyteInktrap text-6xl font-black leading-none md:text-7xl lg:text-8xl"
                  style={{ color: theme.text }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-3 max-w-xl text-base leading-relaxed md:text-lg"
                  style={{ color: theme.label }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
