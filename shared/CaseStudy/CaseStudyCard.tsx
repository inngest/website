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
    <Link href={href} className="group block bg-stone-950 text-basis md:flex">
      <Card variant="hover" className="p-8">
        <div className="flex grow flex-col justify-items-start gap-4">
          <div className="mb-1 h-10">
            <img
              src={logo}
              alt={`${name} logo`}
              title={name}
              className="width-auto shrink-0 text-white transition-all"
              style={{
                height: `${40 * logoScale}px`,
              }}
            />
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="space-between flex min-h-20 grow flex-row items-center gap-8 md:flex-col lg:h-24 lg:flex-row">
            <p className="text-slate-300">{snippet}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-sm font-medium text-muted">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="flex flex-row text-[#CBB26A]">
              Read the story{" "}
              <RiArrowRightSLine className="relative top-px transition-transform duration-150 group-hover:translate-x-1 " />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
