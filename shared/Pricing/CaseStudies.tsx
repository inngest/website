import Link from "next/link";
import Image from "next/image";
import { RiExternalLinkLine } from "@remixicon/react";

const caseStudies: {
  href: string;
  logo: string;
  name: string;
  snippet: React.ReactNode;
}[] = [
  {
    href: "/customers/soundcloud",
    logo: "/assets/customers/soundcloud-logo-white-horizontal.svg",
    name: "SoundCloud",
    snippet: (
      <p>
        Deployed within <b>1 week</b>
      </p>
    ),
  },
  {
    href: "/customers/fey",
    logo: "/assets/customers/fey/fey-icon-name.svg",
    name: "Fey",
    snippet: (
      <p>
        <b>50x faster</b> after switching
      </p>
    ),
  },
  {
    href: "/customers/gitbook",
    logo: "/assets/customers/gitbook-logo-white.svg",
    name: "GitBook",
    snippet: <p>Solved bi-directional synchronization</p>,
  },
];

export default function CaseStudies() {
  return (
    <div className="my-8">
      <p className="text-2xl font-bold py-8">
        Trusted and used in production by companies across the world{" "}
      </p>
      <div className="pt-4 pb-10 grid md:grid-cols-3 md:gap-12 text-left gap-8">
        {caseStudies.map((caseStudy, idx) => (
          <div key={idx}>
            <Image
              src={caseStudy.logo}
              alt={`${caseStudy.name} logo`}
              title={caseStudy.name}
              width={120}
              height={30}
              style={{ height: "40px", width: "auto" }}
              className="shrink-0 text-white width-auto transition-all pb-4 col-span-2"
            />
            {caseStudy.snippet}
            <Link
              className="flex items-center gap-0.5 text-link text-sm pt-1 hover:decoration-link decoration-transparent decoration-1 underline underline-offset-2 cursor-pointer transition-color duration-300"
              href={caseStudy.href}
            >
              Read the case study
              <RiExternalLinkLine className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
