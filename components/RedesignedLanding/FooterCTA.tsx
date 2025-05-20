import Link from "src/components/Link";
import { Button } from "src/components/RedesignedLanding/Button";
import FooterCTABackground from "./FooterCTABackground";

export default function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-stone-950 pb-24 pt-24">
      <FooterCTABackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base/7 font-semibold text-inngestLux">
            In the middle of chaos
          </h2>
          <p className="mt-2 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
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
                <a href="/docs">I'd Rather Look at the Docs First</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
