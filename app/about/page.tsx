import classNames from "src/utils/classNames";
import clsx from "clsx";
import { Metadata } from "next";
import Link from "next/link";

import GridBackground from "src/components/RedesignedLanding/GridBackground";
import Container from "src/shared/layout/Container";
import ArrowRight from "src/shared/Icons/ArrowRight";
// import { Button } from "src/shared/Button";
import Card from "src/components/Card";
import { IS_HIRING } from "@/shared/flags";
import { Button } from "src/components/RedesignedLanding/Button";

const TEAM = [
  {
    name: "Tony Holdstock-Brown",
    role: "CEO & Founder",
    avatar: "/assets/team/tony-2022-10-18.jpg",
  },
  {
    name: "Dan Farrelly",
    role: "CTO & Founder",
    avatar: "/assets/team/dan-f-2023-06-26.jpg",
  },
  {
    name: "Jack Williams",
    role: "Founding Engineer",
    avatar: "/assets/team/jack-2022-10-10.jpg",
  },
  {
    name: "Aaron Harper",
    role: "Engineer",
    avatar: "/assets/team/aaron-h-2023-06-26.jpg",
  },
  {
    name: "Ana Filipa de Almeida",
    role: "Engineer",
    avatar: "/assets/team/ana-a-2023-06-26.jpg",
  },
  {
    name: "Darwin Wu",
    role: "Engineer",
    avatar: "/assets/team/darwin-w-2023-06-26.jpg",
  },
  {
    name: "John Buchta",
    role: "Designer",
    avatar: "/assets/team/john-b-2024-01-21.jpg",
  },
  {
    name: "Sanjana Laddha",
    role: "Designer",
    avatar: "/assets/team/sanjana-v-2024-05-06.jpg",
  },
  {
    name: "Bruno Scheufler",
    role: "Engineer",
    avatar: "/assets/team/bruno-v-2024-05-06.jpg",
  },
  {
    name: "Jacob Heric",
    role: "Engineer",
    avatar: "/assets/team/jacob-heric-2024-11-11.png",
  },
  {
    name: "Charly Poly",
    role: "Marketing",
    avatar: "/assets/team/charly-poly-2024-11-11.jpg",
  },
  {
    name: "Ted Werbel",
    role: "AI Engineer",
    avatar: "/assets/team/ted-werbel-2025-04-22.jpg",
  },
  {
    name: "Riadh Daghmoura",
    role: "Engineer",
    avatar: "/assets/team/riadh-d-2025-06-24.jpg",
  },
  {
    name: "Jakob Evangelista",
    role: "Engineer",
    avatar: "/assets/team/jakob-evangelista-2025-06-24.png",
  },
  {
    name: "Andy Lawrence",
    role: "Engineer",
    avatar: "/assets/team/andy-l-2025-08-01.jpg",
  },
];

const INVESTORS: {
  name: string;
  logo: string;
  maxWidth?: string;
  featured?: boolean;
}[] = [
  {
    name: "Andreessen Horowitz",
    logo: "/assets/about/a16z-logo.svg",
    maxWidth: "240px",
    featured: true,
  },
  {
    name: "Notable Capital",
    logo: "/assets/about/notable-capital-white.svg",
    maxWidth: "240px",
    featured: true,
  },
  {
    name: "Afore.vc",
    logo: "/assets/about/afore-capital-white.png",
    maxWidth: "200px",
  },
  {
    name: "Kleiner Perkins",
    logo: "/assets/about/kleiner-perkins-white.png",
  },
  {
    name: "Banana Capital",
    logo: "/assets/about/banana-capital-white.png",
  },
  {
    name: "Comma Capital",
    logo: "/assets/about/comma-capital-white.png",
  },
];
const ANGELS: {
  name: string;
  bio: string;
  avatar?: string;
  featured?: boolean;
}[] = [
  {
    name: "Guillermo Rauch",
    bio: "CEO of Vercel",
    featured: true,
    avatar: "/assets/about/guillermo-rauch-avatar.jpg",
  },
  {
    name: "Tom Preston-Werner",
    bio: "Founder of Github",
    featured: true,
    avatar: "/assets/about/tom-preston-werner-avatar.png",
  },
  {
    name: "Jason Warner",
    bio: "CEO at Poolside",
  },
  {
    name: "Jake Cooper",
    bio: "Founder at Railway",
  },
  {
    name: "Tristan Handy",
    bio: "CEO & Founder at dbt Labs",
  },
  {
    name: "Oana Olteanu",
    bio: "Early stage investor",
  },
  {
    name: "Ian Livingstone",
    bio: "The Infra Pod, technical leader",
  },
  {
    name: "Pim De Witte",
    bio: "CEO at Medal.tv, Highlight",
  },
];

// Used for key announcements and significant thought leadership for investors
// or potential job applicants
const FEATURED_BLOG_POSTS: { title: string; href: string; date?: string }[] = [
  {
    title: "Inngest raises $6.1M led by a16z",
    href: "/blog/announcing-funding-from-a16z?ref=about",
    date: "January 2024",
  },
  {
    title: "Inngest Raises $3M Seed led by Notable Capital (fka GGV Capital)",
    href: "/blog/announcing-inngest-seed-financing",
    date: "July 2023",
  },
  {
    title: "Inngest: Add Superpowers To Serverless Functions",
    href: "/blog/inngest-add-super-powers-to-serverless-functions",
    date: "April 2023",
  },
  {
    title:
      "Partnership: Vercel + Inngest - The fastest way to ship background functions",
    href: "/blog/vercel-integration",
    date: "October 2022",
  },
];

export const metadata: Metadata = {
  title: "About Inngest",
  description:
    "Inngest is the developer platform for easily building reliable workflows with zero infrastructure",
};

export default function About() {
  return (
    <>
      <div className="max-w-screen relative pb-24 text-stone-50">
        <GridBackground />
        {/* Hero */}
        <div className="relative z-10 mx-auto max-w-5xl px-8">
          <div className="mx-auto mb-20 flex flex-col gap-y-12">
            <div className="z-10 flex flex-col gap-8 pt-24 md:flex-row md:items-end md:justify-between md:gap-16">
              <h1 className="text-nowrap font-whyteInktrap text-[2.25rem] font-normal text-stone-50 md:text-[84px] md:font-normal md:leading-[100.8px] md:tracking-[-4.2px]">
                About Inngest
              </h1>
              <p className="text-balance font-circular text-xl font-normal leading-8 md:font-light">
                Inngest is the platform for building agentic workflows and
                agents powering AI products from experiment to production.
              </p>
            </div>
          </div>
          <div className="mx-auto my-20 flex flex-col gap-8 text-balance text-lg">
            <p className="">
              Shipping reliable software, whether it's an AI agent, a serverless
              application or a distributed system is a time consuming and
              frustrating experience for any software team. Local development is
              painful. Managing infrastructure is tedious. Days to weeks of
              developer time is lost doing this work at every company.
            </p>
            <p>
              Inngest is solving this problem for every software team, no matter
              the team size or experience.
            </p>
          </div>
          {/* Team */}
          <div className="mx-auto my-24 flex flex-col items-start gap-8 text-balance text-lg">
            <h2 className="font-whyteInktrap text-4xl font-normal">Our team</h2>
            <p className="font-circular">
              We've built and scaled systems for years and know that developers
              deserve something better.
            </p>
            {IS_HIRING && (
              <Button
                variant="outline"
                asChild
                className="inline-flex max-[520px]:py-5 max-[520px]:text-[1rem]"
              >
                <Link href="/careers?ref=about">
                  View open roles <span aria-hidden="true">→</span>
                </Link>
              </Button>
            )}
            <div
              className={clsx(
                "grid items-center gap-x-10 gap-y-12",
                "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              )}
            >
              {TEAM.map((person, idx) => {
                return (
                  <div
                    key={person.name}
                    className={clsx("flex flex-col items-start")}
                  >
                    <img className="w-20" src={person.avatar} />

                    <h3 className="mb-1 mt-3 text-sm font-medium">
                      {person.name}
                    </h3>
                    <p
                      className="text-sm leading-5 text-subtle"
                      style={{ lineHeight: "1.5em" }}
                    >
                      {person.role}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Investors */}
          <div className="mx-auto my-24 flex flex-col items-start gap-8 text-balance text-lg">
            <h2 className="font-whyteInktrap text-4xl font-normal">
              Our investors
            </h2>
            <div className="grid items-center gap-8 pb-6 sm:grid-cols-2 md:grid-cols-8">
              {INVESTORS.map((investor) => {
                return (
                  <div
                    key={investor.name}
                    className={classNames(
                      investor.featured
                        ? "mx-auto md:col-span-4"
                        : "mx-auto md:col-span-2",
                      "flex h-[130px] w-full items-center justify-center rounded px-10 py-4"
                    )}
                  >
                    <img
                      style={{ maxHeight: investor.featured ? "96px" : "50px" }}
                      src={investor.logo}
                      alt={investor.name}
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid w-full grid-cols-2 text-left sm:grid-cols-3 md:grid-cols-4">
              {ANGELS.map((a, idx) => (
                <div key={a.name} className="text-sm">
                  <h4>{a.name}</h4>
                  <p className="text-muted">{a.bio}</p>
                  <br />
                </div>
              ))}
            </div>
          </div>
          {/* Blog */}
          <div className="mx-auto my-24 flex flex-col items-start gap-8 text-balance text-lg">
            <h2 className="font-whyteInktrap text-4xl font-normal">
              From our blog
            </h2>
            <div className="flex flex-col gap-4">
              {FEATURED_BLOG_POSTS.map((post) => (
                <div key={post.title} className="flex flex-col gap-2">
                  <h3 className="font-whyteInktrap text-lg font-normal md:text-xl">
                    <a
                      className="text-link hover:underline"
                      href={`${post.href}?ref=about-page`}
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-sm text-subtle">{post.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
