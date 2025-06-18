import Link from "next/link";
import { Button } from "src/components/RedesignedLanding/Button";

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
      <div className="absolute inset-0 z-0 flex justify-center">
        <div className="w-screen bg-stone-900">
          <BackgroundPattern />
        </div>
      </div>

      <div className="relative z-10 w-full">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 p-6 lg:px-12 lg:pt-16">
            <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
              <div>
                <h2 className="mb-4 font-whyteInktrap text-3xl font-medium tracking-[-2px] sm:text-4xl">
                  Enterprise ready
                </h2>
                <p className="font-circuluar mb-6 text-lg font-light text-stone-200">
                  The Inngest platform has been designed from the ground up with
                  security and data privacy in mind. It's been battle tested so
                  you can trust it to run your most critical workloads.
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
      className=" mx-auto h-full w-full max-w-screen-2xl object-cover"
      viewBox="0 0 1726 596"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <g clipPath="url(#clip0_4268_10284)">
        <g clipPath="url(#clip1_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(-43)"
            fill="#CBB26A"
          />
          <circle cx="96.8011" cy="162.077" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip2_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(156.476)"
            fill="#292524"
          />
          <path
            d="M255.369 -7.83594L398.322 239.766H112.415L255.369 -7.83594Z"
            fill="#2C9B63"
          />
        </g>
        <g clipPath="url(#clip3_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(358.19)"
            fill="#CB5C32"
          />
          <circle cx="453.297" cy="128.581" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip4_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(557.667)"
            fill="#292524"
          />
          <path
            d="M762.571 -96.2656L905.524 151.337H619.618L762.571 -96.2656Z"
            fill="#CBB26A"
          />
        </g>
        <g clipPath="url(#clip5_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(759.381)"
            fill="#292524"
          />
          <path
            d="M861.098 15.5061L1004.05 263.109H718.145L861.098 15.5061Z"
            fill="#2C9B63"
          />
        </g>
        <g clipPath="url(#clip6_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(1153.57 194.714) rotate(180)"
            fill="#655279"
          />
          <circle
            cx="1068.2"
            cy="143.919"
            r="126.796"
            transform="rotate(180 1068.2 143.919)"
            fill="#292524"
          />
        </g>
        <g clipPath="url(#clip7_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(1160.57)"
            fill="#CBB26A"
          />
          <circle cx="1341.07" cy="87.9024" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip8_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(1360.05)"
            fill="#292524"
          />
          <path
            d="M1457.82 -7.83594L1600.77 239.766H1314.86L1457.82 -7.83594Z"
            fill="#CB5C32"
          />
        </g>
        <g clipPath="url(#clip9_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(1561.76)"
            fill="#CBB26A"
          />
          <circle cx="1730.06" cy="55.5411" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip10_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(-43 201.714)"
            fill="#292524"
          />
          <path
            d="M4.89981 175.282L147.853 422.884H-138.053L4.89981 175.282Z"
            fill="#655279"
          />
        </g>
        <g clipPath="url(#clip11_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(351.19 396.428) rotate(180)"
            fill="#655279"
          />
          <circle
            cx="265.821"
            cy="345.633"
            r="126.796"
            transform="rotate(180 265.821 345.633)"
            fill="#292524"
          />
        </g>
        <g clipPath="url(#clip12_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(358.19 201.714)"
            fill="#292524"
          />
          <path
            d="M563.095 105.449L706.048 353.051H420.141L563.095 105.449Z"
            fill="#CB5C32"
          />
        </g>
        <g clipPath="url(#clip13_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(559.905 201.714)"
            fill="#CBB26A"
          />
          <circle cx="780.401" cy="401.617" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip14_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(951.857 396.428) rotate(180)"
            fill="#655279"
          />
          <circle
            cx="866.487"
            cy="345.633"
            r="126.796"
            transform="rotate(180 866.487 345.633)"
            fill="#292524"
          />
        </g>
        <g clipPath="url(#clip15_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(958.857 201.714)"
            fill="#292524"
          />
          <path
            d="M1038.88 193.878L1181.83 441.481H895.925L1038.88 193.878Z"
            fill="#2C9B63"
          />
        </g>
        <g clipPath="url(#clip16_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(1160.57 201.714)"
            fill="#292524"
          />
          <path
            d="M1365.48 105.449L1508.43 353.051H1222.52L1365.48 105.449Z"
            fill="#CB5C32"
          />
        </g>
        <g clipPath="url(#clip17_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(1362.29 201.714)"
            fill="#CBB26A"
          />
          <circle cx="1356.29" cy="273.203" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip18_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(1561.76 201.714)"
            fill="#292524"
          />
          <path
            d="M1582.31 111.035L1725.26 358.638H1439.36L1582.31 111.035Z"
            fill="#2C9B63"
          />
        </g>
        <g clipPath="url(#clip19_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(-43 403.429)"
            fill="#292524"
          />
          <path
            d="M130.308 376.11L273.261 623.712H-12.6453L130.308 376.11Z"
            fill="#CB5C32"
          />
        </g>
        <g clipPath="url(#clip20_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(158.714 403.429)"
            fill="#CBB26A"
          />
          <circle cx="379.211" cy="603.331" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip21_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(358.19 403.429)"
            fill="#292524"
          />
          <path
            d="M438.212 395.593L581.165 643.195H295.259L438.212 395.593Z"
            fill="#2C9B63"
          />
        </g>
        <g clipPath="url(#clip22_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(559.905 403.429)"
            fill="#292524"
          />
          <path
            d="M764.809 307.163L907.762 554.765H621.856L764.809 307.163Z"
            fill="#CB5C32"
          />
        </g>
        <g clipPath="url(#clip23_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(761.619 403.429)"
            fill="#292524"
          />
          <path
            d="M841.637 395.593L984.59 643.195H698.683L841.637 395.593Z"
            fill="#2C9B63"
          />
        </g>
        <g clipPath="url(#clip24_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(963.333 403.429)"
            fill="#CBB26A"
          />
          <circle cx="1183.83" cy="603.331" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip25_4268_10284)">
          <rect
            width="194.714"
            height="192.476"
            transform="translate(1162.81 403.429)"
            fill="#292524"
          />
          <path
            d="M1367.71 307.163L1510.67 554.765H1224.76L1367.71 307.163Z"
            fill="#CB5C32"
          />
        </g>
        <g clipPath="url(#clip26_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(1364.52 403.429)"
            fill="#CBB26A"
          />
          <circle cx="1585.02" cy="603.331" r="100.684" fill="#292524" />
        </g>
        <g clipPath="url(#clip27_4268_10284)">
          <rect
            width="192.476"
            height="194.714"
            transform="translate(1756.48 598.143) rotate(180)"
            fill="#655279"
          />
          <circle
            cx="1659.35"
            cy="419.578"
            r="126.796"
            transform="rotate(180 1659.35 419.578)"
            fill="#292524"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_4268_10284">
          <rect
            width="2191"
            height="599"
            fill="white"
            transform="translate(-43)"
          />
        </clipPath>
        <clipPath id="clip1_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(-43)"
          />
        </clipPath>
        <clipPath id="clip2_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(156.476)"
          />
        </clipPath>
        <clipPath id="clip3_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(358.19)"
          />
        </clipPath>
        <clipPath id="clip4_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(557.667)"
          />
        </clipPath>
        <clipPath id="clip5_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(759.381)"
          />
        </clipPath>
        <clipPath id="clip6_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(1153.57 194.714) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip7_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(1160.57)"
          />
        </clipPath>
        <clipPath id="clip8_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(1360.05)"
          />
        </clipPath>
        <clipPath id="clip9_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(1561.76)"
          />
        </clipPath>
        <clipPath id="clip10_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(-43 201.714)"
          />
        </clipPath>
        <clipPath id="clip11_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(351.19 396.428) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip12_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(358.19 201.714)"
          />
        </clipPath>
        <clipPath id="clip13_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(559.905 201.714)"
          />
        </clipPath>
        <clipPath id="clip14_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(951.857 396.428) rotate(180)"
          />
        </clipPath>
        <clipPath id="clip15_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(958.857 201.714)"
          />
        </clipPath>
        <clipPath id="clip16_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(1160.57 201.714)"
          />
        </clipPath>
        <clipPath id="clip17_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(1362.29 201.714)"
          />
        </clipPath>
        <clipPath id="clip18_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(1561.76 201.714)"
          />
        </clipPath>
        <clipPath id="clip19_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(-43 403.429)"
          />
        </clipPath>
        <clipPath id="clip20_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(158.714 403.429)"
          />
        </clipPath>
        <clipPath id="clip21_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(358.19 403.429)"
          />
        </clipPath>
        <clipPath id="clip22_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(559.905 403.429)"
          />
        </clipPath>
        <clipPath id="clip23_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(761.619 403.429)"
          />
        </clipPath>
        <clipPath id="clip24_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(963.333 403.429)"
          />
        </clipPath>
        <clipPath id="clip25_4268_10284">
          <rect
            width="194.714"
            height="192.476"
            fill="white"
            transform="translate(1162.81 403.429)"
          />
        </clipPath>
        <clipPath id="clip26_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(1364.52 403.429)"
          />
        </clipPath>
        <clipPath id="clip27_4268_10284">
          <rect
            width="192.476"
            height="194.714"
            fill="white"
            transform="translate(1756.48 598.143) rotate(180)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
