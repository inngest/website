import { Card } from "./Card";
import Image from "next/image";
import GridBackground from "./GridBackground";

export default function Testimonial() {
  return (
    <div className="relative z-50 mx-auto w-full px-4 py-32 sm:px-8 md:px-12 lg:px-16 xl:max-w-6xl">
      <GridBackground />
      <Card className="relative z-10 overflow-hidden rounded-none border-0 border-stone-800 bg-stone-900">
        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full items-center justify-center lg:w-1/2 ">
            <div className="relative flex h-32 w-full flex-row border-0 sm:h-full sm:w-full">
              <Image
                src="/image.png"
                alt="Pattern"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex w-full flex-col justify-center p-6 sm:p-8 md:p-10 xl:p-12">
            <blockquote className="mb-8 font-whyte text-lg font-normal leading-[2.4rem] text-stone-50 lg:mb-12 xl:text-xl 2xl:text-2xl">
              "The DX and visibility with Inngest is really incredible. We are
              able to develop functions locally easier and faster that with our
              previous queue. Also, Inngest's tools give us the visibility to
              debug issues much quicker than before."
            </blockquote>

            <div className="flex items-center gap-4">
              <Image
                src="/assets/customers/resend.svg"
                alt="Resend"
                title="Resend"
                width={96}
                height={24}
                className="width-auto opacity-90"
              />
              <div className="h-8 w-px bg-stone-600"></div>
              <div className="text-stone-50">
                <div className="font-medium">Bu Kinoshita</div>
                <div className="font-stone-400 text-sm">Co-founder</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
