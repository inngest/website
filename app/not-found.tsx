import dynamic from "next/dynamic";
import PageShell from "@/components/v1/PageShell";
import {
  LOGOMARK_DESIGN_WIDTH,
  LOGOMARK_DESIGN_X,
} from "@/components/v1/sections/shared/logomarkPlacement";
import ButtonLink from "@/components/v1/ButtonLink";

const InngestLogoCanvas = dynamic(
  () => import("@/components/v1/sections/shared/InngestLogoCanvas"),
  { ssr: false },
);

export default function NotFound() {
  return (
    <PageShell>
      <section
        aria-label="Page not found"
        className="relative isolate flex min-h-[70vh] items-center justify-center overflow-x-clip"
      >
        {/* Quote-section particle background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[35vh] top-0 opacity-15 lg:opacity-50"
        >
          <InngestLogoCanvas
            width={LOGOMARK_DESIGN_WIDTH}
            x={LOGOMARK_DESIGN_X}
            originX={0}
            enterRange={1.8}
            exitRange={1.3}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          <p className="font-v1Mono text-[13px] uppercase tracking-[0.12em] text-v1-accent-salmon">
            404
          </p>
          <h1
            className="font-v1Heading leading-[1.1] tracking-[-0.02em] text-v1-frost"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Page not found.
          </h1>
          <p className="max-w-[420px] text-v1-body-lg text-v1-frost/70">
            We&apos;ve triggered an event and a serverless function is
            forwarding it to the team as you read this.
          </p>
          <ButtonLink href="/" variant="primary">
            Back to home
          </ButtonLink>
        </div>
      </section>
    </PageShell>
  );
}
