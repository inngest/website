import Link from "next/link";
import { Button } from "./Button";
import GridBackground from "./GridBackground";

export default function TrustFeaturesSection() {
  const features = [
    {
      title: "SOC 2 COMPLIANT",
      description:
        "Regular security audits and compliance with SOC 2 standards.",
      link: "Read more here",
      linkHref: "#",
    },
    {
      title: "E2E ENCRYPTION",
      description:
        "Encrypt all data that passes through Inngest with end-to-end encryption middleware.",
    },
    {
      title: "SSO & SAML",
      description: "Single sign-on and SAML support for enterprise customers.",
    },
    {
      title: "100K+ EXECUTIONS PER SECOND",
      description:
        "Designed for your heavy workloads with capacity for bursting.",
    },
    {
      title: "LOW LATENCY",
      description: "Inngest is designed to be low latency for all functions.",
    },
    {
      title: "HIPAA BAA AVAILABLE",
      description: "Ready to handle sensitive data.",
    },
  ];

  return (
    <section className="relative flex min-h-[500px] items-end justify-center overflow-hidden text-stone-50 md:min-h-[600px] lg:min-h-[500px]">
      <GridBackground className="!bg-stone-950" />

      <div className="absolute inset-0 z-0 flex justify-center">
        <div className="max-w-screen-2xl bg-stone-900">
          <BackgroundPattern />
        </div>
      </div>

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 p-6 lg:px-12 lg:pt-16">
            <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
              <div>
                <h2 className="mb-4 font-whyte text-3xl font-light tracking-[-2px] sm:text-4xl">
                  Built for{" "}
                  <span className="font-whyteInktrap font-medium">trust.</span>
                </h2>
                <p className="font-circuluar mb-6 text-lg font-light text-stone-200">
                  Inngest provides enterprise-grade reliability and scalability
                  for your most complex workflows, so your team can focus on
                  building products, not managing infrastructure.
                </p>
                <Button variant="outline" asChild>
                  <Link href="#">Contact us</Link>
                </Button>
              </div>

              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 md:gap-y-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="border-t border-stone-400 pt-3 font-circular"
                  >
                    <h3 className="mb-2 border-stone-50 font-circular text-base font-medium tracking-wider">
                      {feature.title}
                    </h3>
                    <p className="text-sm font-light text-stone-50 ">
                      {feature.description}
                      {feature.link && (
                        <>
                          {" "}
                          <a
                            href={feature.linkHref}
                            className="text-gray-300 underline transition-colors hover:text-white"
                          >
                            {feature.link}
                          </a>
                          .
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundPattern() {
  return (
    <svg
      className="mx-auto h-full w-full max-w-screen-2xl object-cover"
      viewBox="0 0 1726 596"
      width="1726"
      height="596"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(-43)"
          fill="#CBB26A"
        />
        <circle cx="70.1224" cy="156.928" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip1_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(156)"
          fill="#292524"
        />
        <path
          d="M254.892 -7.83594L397.846 239.766H111.939L254.892 -7.83594Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip2_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(355)"
          fill="#CB5C32"
        />
        <circle cx="450.106" cy="128.581" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip3_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(554)"
          fill="#292524"
        />
        <path
          d="M758.904 -96.2656L901.858 151.337H615.951L758.904 -96.2656Z"
          fill="#CBB26A"
        />
      </g>
      <g clipPath="url(#clip4_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(753)"
          fill="#292524"
        />
        <path
          d="M854.717 15.5061L997.671 263.109H711.764L854.717 15.5061Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip5_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1144 192) rotate(180)"
          fill="#655279"
        />
        <circle
          cx="1058.63"
          cy="141.204"
          r="126.796"
          transform="rotate(180 1058.63 141.204)"
          fill="#292524"
        />
      </g>
      <g clipPath="url(#clip6_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1151)"
          fill="#CBB26A"
        />
        <circle cx="1331.5" cy="87.9024" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip7_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1350)"
          fill="#292524"
        />
        <path
          d="M1447.77 -7.83594L1590.72 239.766H1304.82L1447.77 -7.83594Z"
          fill="#CB5C32"
        />
      </g>
      <g clipPath="url(#clip8_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1549)"
          fill="#CBB26A"
        />
        <circle cx="1717.3" cy="55.5411" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip9_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(149 391) rotate(180)"
          fill="#655279"
        />
        <circle
          cx="63.6302"
          cy="340.204"
          r="126.796"
          transform="rotate(180 63.6302 340.204)"
          fill="#292524"
        />
      </g>
      <g clipPath="url(#clip10_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(156 199)"
          fill="#292524"
        />
        <path
          d="M360.904 102.734L503.858 350.337H217.951L360.904 102.734Z"
          fill="#CB5C32"
        />
      </g>
      <g clipPath="url(#clip11_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(355 199)"
          fill="#CBB26A"
        />
        <circle cx="575.496" cy="398.902" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip12_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(746 391) rotate(180)"
          fill="#655279"
        />
        <circle
          cx="660.63"
          cy="340.204"
          r="126.796"
          transform="rotate(180 660.63 340.204)"
          fill="#292524"
        />
      </g>
      <g clipPath="url(#clip13_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(753 199)"
          fill="#292524"
        />
        <path
          d="M833.021 191.164L975.975 438.766H690.068L833.021 191.164Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip14_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(952 199)"
          fill="#292524"
        />
        <path
          d="M1156.9 102.734L1299.86 350.337H1013.95L1156.9 102.734Z"
          fill="#CB5C32"
        />
      </g>
      <g clipPath="url(#clip15_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1151 199)"
          fill="#CBB26A"
        />
        <circle cx="1145" cy="270.488" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip16_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1350 199)"
          fill="#292524"
        />
        <path
          d="M1370.55 108.321L1513.5 355.923H1227.6L1370.55 108.321Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip17_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1549 199)"
          fill="#292524"
        />
        <path
          d="M1629.02 215.164L1771.97 462.766H1486.07L1629.02 215.164Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip18_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(-43 398)"
          fill="#292524"
        />
        <path
          d="M37.0214 390.164L179.975 637.766H-105.932L37.0214 390.164Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip19_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(156 398)"
          fill="#292524"
        />
        <path
          d="M360.904 301.734L503.858 549.337H217.951L360.904 301.734Z"
          fill="#CB5C32"
        />
      </g>
      <g clipPath="url(#clip20_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(355 398)"
          fill="#292524"
        />
        <path
          d="M435.017 390.164L577.971 637.766H292.064L435.017 390.164Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip21_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(554 398)"
          fill="#CBB26A"
        />
        <circle cx="774.496" cy="597.902" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip22_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(753 398)"
          fill="#292524"
        />
        <path
          d="M957.904 301.734L1100.86 549.337H814.951L957.904 301.734Z"
          fill="#CB5C32"
        />
      </g>
      <g clipPath="url(#clip23_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(952 398)"
          fill="#CBB26A"
        />
        <circle cx="1172.5" cy="597.902" r="100.684" fill="#292524" />
      </g>
      <g clipPath="url(#clip24_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1343 590) rotate(180)"
          fill="#655279"
        />
        <circle
          cx="1245.87"
          cy="411.435"
          r="126.796"
          transform="rotate(180 1245.87 411.435)"
          fill="#292524"
        />
      </g>
      <g clipPath="url(#clip25_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1350 398)"
          fill="#292524"
        />
        <path
          d="M1430.02 390.164L1572.97 637.766H1287.07L1430.02 390.164Z"
          fill="#2C9B63"
        />
      </g>
      <g clipPath="url(#clip26_4268_6272)">
        <rect
          width="192"
          height="192"
          transform="translate(1549 398)"
          fill="#292524"
        />
        <path
          d="M1753.9 301.734L1896.86 549.337H1610.95L1753.9 301.734Z"
          fill="#CB5C32"
        />
      </g>
      <defs>
        <clipPath id="clip0_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(-43)"
          />
        </clipPath>
        <clipPath id="clip1_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(156)"
          />
        </clipPath>
        <clipPath id="clip2_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(355)"
          />
        </clipPath>
        <clipPath id="clip3_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(554)"
          />
        </clipPath>
        <clipPath id="clip4_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(753)"
          />
        </clipPath>
        <clipPath id="clip5_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1144 192) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip6_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1151)"
          />
        </clipPath>
        <clipPath id="clip7_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1350)"
          />
        </clipPath>
        <clipPath id="clip8_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1549)"
          />
        </clipPath>
        <clipPath id="clip9_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(149 391) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip10_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(156 199)"
          />
        </clipPath>
        <clipPath id="clip11_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(355 199)"
          />
        </clipPath>
        <clipPath id="clip12_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(746 391) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip13_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(753 199)"
          />
        </clipPath>
        <clipPath id="clip14_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(952 199)"
          />
        </clipPath>
        <clipPath id="clip15_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1151 199)"
          />
        </clipPath>
        <clipPath id="clip16_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1350 199)"
          />
        </clipPath>
        <clipPath id="clip17_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1549 199)"
          />
        </clipPath>
        <clipPath id="clip18_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(-43 398)"
          />
        </clipPath>
        <clipPath id="clip19_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(156 398)"
          />
        </clipPath>
        <clipPath id="clip20_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(355 398)"
          />
        </clipPath>
        <clipPath id="clip21_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(554 398)"
          />
        </clipPath>
        <clipPath id="clip22_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(753 398)"
          />
        </clipPath>
        <clipPath id="clip23_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(952 398)"
          />
        </clipPath>
        <clipPath id="clip24_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1343 590) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip25_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1350 398)"
          />
        </clipPath>
        <clipPath id="clip26_4268_6272">
          <rect
            width="192"
            height="192"
            fill="white"
            transform="translate(1549 398)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
