"use client";
import { Button } from "src/components/RedesignedLanding/Button";
import FooterCTABackground from "./FooterCTABackground";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../utils/classNames";

export default function FooterCTA() {
  const [trackMouse, setTrackMouse] = useState(false);
  const pathname = usePathname();

  return (
    <section className="relative overflow-hidden bg-stone-950 pb-24 pt-24">
      <FooterCTABackground shouldTrackMouse={trackMouse} />

      <div
        className="relative z-10 mx-auto max-w-7xl"
        onMouseEnter={() => setTrackMouse(true)}
        onMouseLeave={() => setTrackMouse(false)}
      >
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className={cn(
              "text-base/7 font-semibold text-inngestLux",
              pathname.startsWith("/pricing") && "hidden"
            )}
          >
            In the middle of chaos
          </h2>
          <p className="mb-4 text-balance font-whyteInktrap text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {pathname.startsWith("/pricing")
              ? "Need help deciding which plan to choose?"
              : "Develop reliable AI products, everytime"}
          </p>
          <div className="flex flex-col items-center justify-center gap-x-6 sm:flex-row">
            <div className="mt-4 flex w-64 justify-center sm:w-auto">
              <Button className="w-full sm:w-auto" variant="default" asChild>
                <Link href={`/contact?ref=${pathname}-footer-cta`}>
                  Let's Talk
                </Link>
              </Button>
            </div>

            <div
              className={cn(
                "mt-4 flex w-64 justify-center sm:w-auto",
                pathname.startsWith("/pricing") && "hidden"
              )}
            >
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/docs?ref=homepage-footer-cta">
                  I'd rather look at the docs first
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
