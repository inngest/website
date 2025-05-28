import { Card } from "./Card";
import Image from "next/image";

export default function Testimonial() {
  return (
    <div className="relative z-50 mx-auto w-full max-w-6xl py-32">
      <Card className="overflow-hidden rounded-none border-0 border-stone-800 bg-stone-900">
        <div className="flex flex-col lg:flex-row">
          <div className="flex w-full items-center justify-center lg:w-1/3">
            <div className="h-32 w-full border-0 sm:w-32 lg:h-full lg:w-full">
              <Pattern />
            </div>
          </div>

          <div className="flex w-full flex-col justify-center p-8 lg:w-2/3 lg:p-12">
            <blockquote className="mb-8 font-whyte text-lg font-normal leading-[2.4rem] text-stone-50 lg:mb-12 lg:text-xl xl:text-2xl">
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

function Pattern() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 376 376"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className="h-full w-full"
    >
      <g clipPath="url(#clip0_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(94 94) rotate(-180)"
          fill="#2C9B63"
        />
        <circle
          cx="-0.277336"
          cy="0.69139"
          r="89.9727"
          transform="rotate(-180 -0.277336 0.69139)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip1_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(94 94) rotate(-90)"
          fill="#2C9B63"
        />
        <circle
          cx="95.6992"
          cy="93.457"
          r="89.9727"
          transform="rotate(-90 95.6992 93.457)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip2_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(188 94) rotate(-90)"
          fill="#CBB26A"
        />
        <circle
          cx="189.605"
          cy="93.0742"
          r="89.9727"
          transform="rotate(-90 189.605 93.0742)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip3_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(282 -7.62939e-06)"
          fill="#CBB26A"
        />
        <circle cx="376.277" cy="93.3086" r="89.9727" fill="#1C1917" />
      </g>
      <g clipPath="url(#clip4_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(0 188) rotate(-90)"
          fill="#2C9B63"
        />
        <circle
          cx="1.69921"
          cy="188.457"
          r="89.9727"
          transform="rotate(-90 1.69921 188.457)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip5_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(188 94) rotate(90)"
          fill="#2C9B63"
        />
        <circle
          cx="183.301"
          cy="94.543"
          r="89.9727"
          transform="rotate(90 183.301 94.543)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip6_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(282 94) rotate(90)"
          fill="#CBB26A"
        />
        <circle
          cx="283.301"
          cy="93.543"
          r="89.9727"
          transform="rotate(90 283.301 93.543)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip7_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(376 188) rotate(-180)"
          fill="#CBB26A"
        />
        <circle
          cx="279.326"
          cy="91.7969"
          r="91.8672"
          transform="rotate(-180 279.326 91.7969)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip8_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(94 188) rotate(90)"
          fill="#CBB26A"
        />
        <circle
          cx="92.3008"
          cy="187.543"
          r="89.9727"
          transform="rotate(90 92.3008 187.543)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip9_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(188 282) rotate(-180)"
          fill="#CBB26A"
        />
        <circle
          cx="93.7227"
          cy="187.691"
          r="89.9727"
          transform="rotate(-180 93.7227 187.691)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip10_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(188 282) rotate(-90)"
          fill="#2C9B63"
        />
        <circle
          cx="189.605"
          cy="281.074"
          r="89.9727"
          transform="rotate(-90 189.605 281.074)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip11_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(282 188)"
          fill="#2C9B63"
        />
        <circle cx="376.277" cy="281.309" r="89.9727" fill="#1C1917" />
      </g>
      <g clipPath="url(#clip12_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(0 376) rotate(-90)"
          fill="#CBB26A"
        />
        <circle
          cx="1.60546"
          cy="375.074"
          r="89.9727"
          transform="rotate(-90 1.60546 375.074)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip13_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(94 282)"
          fill="#CBB26A"
        />
        <circle cx="188.277" cy="375.309" r="89.9727" fill="#1C1917" />
      </g>
      <g clipPath="url(#clip14_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(282 282) rotate(90)"
          fill="#2C9B63"
        />
        <circle
          cx="280.301"
          cy="282.543"
          r="89.9727"
          transform="rotate(90 280.301 282.543)"
          fill="#1C1917"
        />
      </g>
      <g clipPath="url(#clip15_4268_9822)">
        <rect
          width="94"
          height="94"
          transform="translate(376 376) rotate(-180)"
          fill="#2C9B63"
        />
        <circle
          cx="281.723"
          cy="282.691"
          r="89.9727"
          transform="rotate(-180 281.723 282.691)"
          fill="#1C1917"
        />
      </g>
      <defs>
        <clipPath id="clip0_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(94 94) rotate(-180)"
          />
        </clipPath>
        <clipPath id="clip1_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(94 94) rotate(-90)"
          />
        </clipPath>
        <clipPath id="clip2_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(188 94) rotate(-90)"
          />
        </clipPath>
        <clipPath id="clip3_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(282 -7.62939e-06)"
          />
        </clipPath>
        <clipPath id="clip4_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(0 188) rotate(-90)"
          />
        </clipPath>
        <clipPath id="clip5_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(188 94) rotate(90)"
          />
        </clipPath>
        <clipPath id="clip6_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(282 94) rotate(90)"
          />
        </clipPath>
        <clipPath id="clip7_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(376 188) rotate(-180)"
          />
        </clipPath>
        <clipPath id="clip8_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(94 188) rotate(90)"
          />
        </clipPath>
        <clipPath id="clip9_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(188 282) rotate(-180)"
          />
        </clipPath>
        <clipPath id="clip10_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(188 282) rotate(-90)"
          />
        </clipPath>
        <clipPath id="clip11_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(282 188)"
          />
        </clipPath>
        <clipPath id="clip12_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(0 376) rotate(-90)"
          />
        </clipPath>
        <clipPath id="clip13_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(94 282)"
          />
        </clipPath>
        <clipPath id="clip14_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(282 282) rotate(90)"
          />
        </clipPath>
        <clipPath id="clip15_4268_9822">
          <rect
            width="94"
            height="94"
            fill="white"
            transform="translate(376 376) rotate(-180)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
