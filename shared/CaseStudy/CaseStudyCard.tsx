import Link from "next/link";
import Image from "next/image";
import { RiArrowRightSLine } from "@remixicon/react";

import Card from "src/components/Card";

export default function CaseStudyCard({
  href,
  title,
  snippet,
  name,
  logo,
  tags = [],
  logoScale = 1,
}: {
  href: string;
  title: string;
  snippet: React.ReactNode;
  name: string;
  logo: string;
  logoScale?: number;
  tags?: string[];
}) {
  return (
    <Link href={href} className="group text-basis block md:flex">
      <Card variant="hover" className="p-8">
        <div className="grow flex flex-col gap-4 justify-items-start">
          <div className="h-10 mb-1">
            <img
              src={logo}
              alt={`${name} logo`}
              title={name}
              className="shrink-0 text-white width-auto transition-all"
              style={{
                height: `${40 * logoScale}px`,
              }}
            />
          </div>
          <h2 className="font-bold text-xl">{title}</h2>
          <div className="grow min-h-20 lg:h-24 flex flex-row md:flex-col lg:flex-row items-center space-between gap-8">
            <p className="text-slate-300">{snippet}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-sm font-medium text-muted">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="flex flex-row text-link">
              Read the story{" "}
              <RiArrowRightSLine className="group-hover:translate-x-1 relative top-px transition-transform duration-150 " />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
