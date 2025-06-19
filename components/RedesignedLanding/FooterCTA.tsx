"use client";
import Link from "src/components/Link";
import { Button } from "src/components/RedesignedLanding/Button";
import FooterCTABackground from "./FooterCTABackground";
import { useState } from "react";

export default function FooterCTA() {
  const [trackMouse, setTrackMouse] = useState(false);

  return (
    <section className="relative overflow-hidden bg-stone-950 pb-24 pt-24">
      <FooterCTABackground shouldTrackMouse={trackMouse} />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="p-3 text-base/7 font-semibold text-inngestLux"
            onMouseEnter={() => setTrackMouse(true)}
            onMouseLeave={() => setTrackMouse(false)}
          >
            In the middle of chaos
          </h2>
          <p className="mb-4 text-balance font-whyteInktrap text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Develop reliable AI products, everytime
          </p>
          <div className="flex flex-col items-center justify-center gap-x-6 sm:flex-row">
            <div className="mt-4 flex w-64 justify-center sm:w-auto">
              <Button className="w-full sm:w-auto" variant="default" asChild>
                <a href="#">Let's Talk</a>
              </Button>
            </div>

            <div className="mt-4 flex w-64 justify-center sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <a href="/docs">I'd rather look at the docs first</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
