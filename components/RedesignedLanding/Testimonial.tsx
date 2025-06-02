import Image from "next/image";
import GridBackground from "./GridBackground";

export default function Testimonial() {
  return (
    <section className="relative isolate overflow-hidden px-6 lg:px-8">
      <GridBackground />
      <div className="relative mx-auto max-w-2xl py-24 sm:py-32 lg:max-w-5xl">
        <figure className="relative z-10 grid grid-cols-1 items-center gap-x-6 bg-stone-900 lg:gap-x-10 lg:pr-8">
          <div className="relative order-2 col-span-1 p-4 sm:p-6 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:p-0">
            <blockquote className="font-whyteInktrap text-base font-normal text-stone-50 sm:text-lg">
              <p>
                "The DX and visibility with Inngest is really incredible. We are
                able to develop functions locally easier and faster that with
                our previous queue. Also, Inngest's tools give us the visibility
                to debug issues much quicker than before."{" "}
              </p>
            </blockquote>
          </div>
          <div className="order-1 col-span-1 h-40 w-full border-none lg:order-none lg:col-end-1 lg:row-span-4 lg:h-auto lg:w-72">
            <div className="relative h-full w-full">
              <Image
                width={640}
                height={160}
                src="/image2.png"
                alt=""
                className="h-full w-full rounded-none object-cover object-bottom lg:hidden"
              />
              <Image
                width={288}
                height={287.23}
                src="/image.png"
                alt=""
                className="hidden lg:block"
              />
            </div>
          </div>
          <figcaption className="order-3 px-4 pb-4 pt-6 text-base sm:px-6 sm:pb-6 lg:order-none lg:col-start-1 lg:row-start-3 lg:px-0 lg:pb-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image
                src="/assets/customers/resend.svg"
                alt="Resend"
                title="Resend"
                width={80}
                height={20}
                className="width-auto opacity-90 sm:h-6 sm:w-24"
              />
              <div className="h-6 w-px bg-stone-600 sm:h-8"></div>
              <div className="font-circular text-stone-50">
                <div className=" text-sm font-normal sm:text-lg">
                  Bu Kinoshita
                </div>
                <div className="font-stone-400 text-base sm:text-sm">
                  Co-founder
                </div>
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
