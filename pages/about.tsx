import classNames from "src/utils/classNames";
import clsx from "clsx";

import Header from "src/shared/Header";
import Container from "src/shared/layout/Container";
import Footer from "src/shared/Footer";
import ArrowRight from "src/shared/Icons/ArrowRight";
import { Button } from "src/shared/Button";
import Card from "src/components/Card";
import { IS_HIRING } from "@/shared/flags";
import HiringCallout from "@/shared/HiringCallout";

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
    name: "Chris Dzombak",
    role: "Engineer",
    avatar: "/assets/team/chris-v-2024-05-06.jpg",
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
    name: "Andrew Dahl",
    role: "Engineer",
    avatar: "/assets/team/andrew-dahl-2024-11-11.jpg",
  },
  {
    name: "Ted Werbel",
    role: "AI Engineer",
    avatar: "/assets/team/ted-werbel-2025-04-22.jpg",
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
    bio: "Former CTO at GitHub",
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
    bio: "Partner at Signalfire",
  },
  {
    name: "Ian Livingstone",
    bio: "Technical Advisor at Snyk",
  },
  {
    name: "Pim De Witte",
    bio: "CEO at Medal.tv",
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

export async function getStaticProps() {
  return {
    props: {
      meta: {
        title: "About Inngest",
        description:
          "Inngest is the developer platform for easily building reliable workflows with zero infrastructure",
      },
      designVersion: "2",
    },
  };
}

export default function About() {
  return (
    <div className="font-sans">
      <Header />
      <main className="pt-16">
        <Container className="m-auto text-basis">
          <div className="mx-auto max-w-4xl">
            <header className="lg:my-24 my-8 text-center">
              {IS_HIRING && (
                <div className="mb-4">
                  <HiringCallout />
                </div>
              )}
              <h1 className="mt-2 mb-6 pr-4 text-3xl md:text-5xl tracking-tight font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#f2e3ff] via-white to-[#e3e9ff] drop-shadow">
                About Inngest
              </h1>
              <p className="mt-8 mx-auto max-w-lg text-lg font-regular text-balance">
                Inngest is the developer platform for easily building reliable
                workflows with zero infrastructure.
              </p>
            </header>

            <div className="mx-auto max-w-[800px] text-center flex flex-col gap-8 text-balance">
              <p>
                Shipping reliable background jobs and workflows are a time
                consuming and frustrating experience for any software team.
                Local development is painful. Managing infrastructure is
                tedious. Days to weeks of developer time is lost doing this work
                at every company.
              </p>
              <p>
                Inngest is solving this problem for every software team, no
                matter team size or experience.
              </p>
            </div>

            <div className="mt-8 lg:mt-12 flex justify-center">
              <Button
                href="/blog/announcing-funding-from-a16z?ref=about"
                className="group"
              >
                <span className="hidden md:inline">News: </span>Inngest raises
                $6.1M led by a16z
                <ArrowRight className="group-hover:translate-x-1.5 relative top-px transition-transform duration-150 " />
              </Button>
            </div>
          </div>

          <div className="my-32 mx-auto text-slate-300">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center text-white">
              Our Team
            </h2>
            <p className="mt-2 text-center text-subtle">
              We've built and scaled systems for years and know that developers
              deserve something better.
            </p>
            <div
              className={clsx(
                "mt-20 mb-6 grid md:px-24 gap-x-10 gap-y-16 items-center",
                "grid-cols-2 lg:grid-cols-4"
              )}
            >
              {TEAM.map((person, idx) => {
                return (
                  <div
                    key={person.name}
                    className={clsx(
                      "flex flex-col items-center",
                      // Change this with team size to center the last row
                      idx === 12 && "lg:col-start-2"
                    )}
                  >
                    <img className="w-20 rounded-lg" src={person.avatar} />

                    <h3 className="mt-4 mb-1 text-base text-slate-200 font-medium">
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

          <aside className="max-w-[720px] m-auto mt-32">
            <Card className="rounded-lg px-6 py-8 md:px-10 md:p-12 border border-slate-900 text-center shadow items-center">
              <h3 className="text-md lg:text-lg font-semibold text-white mb-4">
                Want to join the team?
              </h3>
              <p className="text-base mb-8">
                We're just getting started and are looking for people that want
                to contribute highly to an early-stage startup focused on
                solving developer problems.
              </p>
              <Button
                href="/careers?ref=about"
                arrow="right"
                className="inline-flex"
              >
                View the open roles
              </Button>
            </Card>
          </aside>
        </Container>
        <div className="bg-surfaceSubtle pt-60 pb-32 -mt-36">
          <Container className="m-auto">
            <div className="mx-auto py-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium text-center text-white mb-10">
                Our Investors
              </h2>
            </div>
            <div className="pb-6 grid sm:grid-cols-2 md:grid-cols-8 gap-8 mb-12 items-center">
              {INVESTORS.map((investor) => {
                return (
                  <div
                    className={classNames(
                      investor.featured
                        ? "md:col-span-4 mx-auto"
                        : "md:col-span-2 mx-auto",
                      "flex items-center rounded w-full justify-center px-10 py-4 h-[130px]"
                    )}
                  >
                    <img
                      key={investor.name}
                      style={{ maxHeight: investor.featured ? "96px" : "50px" }}
                      src={investor.logo}
                      alt={investor.name}
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-20 text-center">
              {ANGELS.map((a, idx) =>
                a.featured ? (
                  <div
                    key={a.name}
                    className="mb-4 flex flex-col items-center gap-4 text-lg"
                  >
                    <img
                      src={a.avatar}
                      alt={`Image of ${a.name}`}
                      className="rounded-lg h-16 w-16"
                    />
                    <span>
                      {a.name}
                      <br />
                      <span className="text-muted">{a.bio}</span>
                    </span>
                  </div>
                ) : (
                  <div key={a.name} className="text-sm">
                    <h4>{a.name}</h4>
                    <p className="text-muted">{a.bio}</p>
                    <br />
                  </div>
                )
              )}
            </div>
          </Container>
        </div>
        <Container>
          {FEATURED_BLOG_POSTS.length && (
            <div className="pt-32 pb-16">
              <h2 className="text-xl sm:text-3xl font-medium text-center mb-8">
                From our blog
              </h2>

              <div className=" flex flex-col gap-4 justify-center items-center">
                {FEATURED_BLOG_POSTS.map((p, idx) => (
                  <p key={p.href} className="text-base">
                    <a
                      className="text-link hover:underline"
                      href={`${p.href}?ref=about-page`}
                    >
                      {p.title} →
                    </a>
                    {p.date && (
                      <span className="text-basis ml-2">{p.date}</span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>

      <div className="mt-48">
        <Footer />
      </div>
    </div>
  );
}
