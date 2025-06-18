import Link from "src/components/Link";
import { Button } from "src/components/RedesignedLanding/Button";
import FooterCTABackground from "./FooterCTABackground";

export default function FooterCTA() {
  return (
    <section className="relative overflow-hidden bg-stone-950 pb-24 pt-24">
      <FooterCTABackground />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-md text-center">
          <p className="font-inktrap mt-2 text-center text-[32px] font-normal leading-[32px] tracking-[-1.6px] text-white sm:text-5xl sm:leading-[1.2] sm:tracking-[-4.2px]">
            Need help deciding which plan to choose?
          </p>
          <div className="flex flex-col items-center justify-center gap-x-6 sm:flex-row">
            <div className="mt-4 flex w-64 justify-center sm:w-auto">
              <Button className="w-full sm:w-auto" variant="default" asChild>
                <a href="#">Talk to us</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
