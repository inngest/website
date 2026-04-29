import Image from "next/image";

const COMPANIES = [
  { name: "Cohere",              logo: "/assets/customers/cohere-logo-white.svg",         h: 20 },
  { name: "11x",                 logo: "/assets/customers/11x-logo.svg",                   h: 22 },
  { name: "LiveKit",             logo: null,                                                h: 20 },
  { name: "mintlify",            logo: null,                                                h: 20 },
  { name: "BÆRSkin",            logo: "/assets/customers/baerskintactical-logo-white.svg", h: 28 },
  { name: "Stuut Technologies",  logo: null,                                                h: 20 },
  { name: "Mercury",             logo: null,                                                h: 20 },
  { name: "Wealthfront",         logo: null,                                                h: 20 },
  { name: "Gnosis Freight",      logo: null,                                                h: 20 },
  { name: "Remitly",             logo: null,                                                h: 20 },
];

export function LogosSection() {
  return (
    <section className="border-t border-white/5 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-white/30">
          With participation from engineers at
        </p>
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
          {COMPANIES.map((c) =>
            c.logo ? (
              <Image
                key={c.name}
                src={c.logo}
                alt={c.name}
                width={120}
                height={c.h}
                style={{ height: c.h, width: "auto", opacity: 0.6 }}
                className="transition-opacity hover:opacity-100"
              />
            ) : (
              <span
                key={c.name}
                className="font-sans text-sm font-semibold tracking-tight transition-opacity hover:opacity-100"
                style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "-0.01em" }}
              >
                {c.name}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
