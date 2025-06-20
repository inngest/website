"use client";
import { useState, useEffect } from "react";
import {
  RiMenuLine,
  RiCloseLine,
  RiGithubFill,
  RiDiscordFill,
  RiTwitterXFill,
  RiArrowRightLine,
  RiBlueskyFill,
} from "@remixicon/react";
import Logo from "src/shared/Icons/Logo";
import classNames from "src/utils/classNames";
import Container from "src/shared/layout/Container";
import Menu, { type MenuProps } from "./Nav/Menu";
import { productLinks, resourcesLinks } from "./Nav/links";
import Dropdown from "./Dropdown";

// Manual count of stars on GitHub for now
// Run pnpm run github:stars to get the latest count
import githubData from "src/data/github.json";

const githubStars = githubData.stars;

const menu: {
  title: string;
  url?: string;
  links?: MenuProps;
  className?: string;
}[] = [
  {
    title: "Product",
    links: productLinks,
  },
  {
    title: "Docs",
    links: resourcesLinks,
    url: "/docs",
  },
  {
    title: "Customers",
    url: "/customers",
  },
  {
    title: "Pricing",
    url: "/pricing",
  },
  {
    title: "Blog",
    url: "/blog",
    className: "md:hidden min-[1120px]:flex", // Hide on md
  },
];

const iconLinks: {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}[] = [
  {
    title: "Discord",
    url: "/discord",
    icon: RiDiscordFill,
    iconClassName: "scale-125",
  },
  {
    title: "X",
    url: "https://x.com/inngest",
    icon: RiTwitterXFill,
  },
  {
    title: "Bluesky",
    url: "https://bsky.app/profile/inngest.com",
    icon: RiBlueskyFill,
  },
];

export default function Nav() {
  const [scroll, setScroll] = useState(false);
  const [menuState, setMenuState] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 40);
    });
  }, []);

  const toggleMenu = () => {
    setMenuState(!menuState);
  };

  return (
    <header
      className={classNames(
        scroll ? `bg-canvasBase/80 backdrop-blur` : "",
        `sticky left-0 right-0 top-0 z-[100] font-circular transition-colors duration-200`
      )}
    >
      <Container className="flex items-center justify-between px-0">
        <div className="flex w-full items-center">
          <div
            className={classNames(
              menuState ? `bg-canvasBase` : ``,
              `flex w-full items-center justify-between gap-6 py-5 md:w-auto md:bg-transparent md:py-0`
            )}
          >
            <a href="/" className="mr-4">
              <Logo className="relative top-[2px] w-24 text-basis" />
            </a>
            <div className="flex grow justify-end">
              <OpenSourceButton className="md:hidden" />
            </div>
            <button
              className="text-basis md:hidden"
              onClick={() => toggleMenu()}
            >
              {menuState ? <RiCloseLine /> : <RiMenuLine />}
            </button>
          </div>
          <nav
            className={classNames(
              menuState ? `block` : `hidden`,
              `fixed bottom-0 left-0 right-0 top-[0] -z-10 h-screen max-h-screen w-full overflow-y-scroll bg-canvasBase pt-[76px] md:static md:bottom-auto md:z-0 md:flex md:h-auto md:overflow-visible md:bg-transparent md:pt-0`
            )}
          >
            <div className="flex w-full flex-col items-start md:flex-row md:items-center">
              <ul className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center md:gap-0">
                {menu.map(({ title, url, links, className = "" }, idx) =>
                  links ? (
                    <li
                      key={idx}
                      className="group relative flex w-full items-center text-sm font-medium text-basis/90 md:w-auto md:py-6"
                    >
                      {url ? (
                        <a
                          href={`${url}?ref=nav`}
                          className={`hidden items-center text-nowrap px-7 py-2 text-sm font-medium text-basis/90 hover:text-primary-intense md:flex md:px-5 ${className}`}
                        >
                          {title}
                        </a>
                      ) : (
                        <div className="transition-color hidden cursor-pointer text-nowrap px-7 py-2 md:block md:px-5 group-hover:md:text-primary-intense">
                          {title}
                        </div>
                      )}
                      <Menu {...links} headerUrl={url} />
                    </li>
                  ) : (
                    <li key={idx}>
                      <a
                        href={`${url}?ref=nav`}
                        className={`flex items-center text-nowrap px-7 py-2 text-sm font-medium text-basis/90 hover:text-primary-intense md:px-5 ${className}`}
                      >
                        {title}
                      </a>
                    </li>
                  )
                )}
              </ul>
              <ul className="mt-6 flex flex-shrink-0 items-center gap-3 px-4 md:mt-0 md:hidden md:px-3 xl:flex">
                {iconLinks.map(
                  ({ title, url, iconClassName = "", ...item }, idx) => (
                    <li key={idx}>
                      <a
                        href={url}
                        className={`flex flex-shrink-0 items-center px-3.5 py-2 text-basis/90 hover:text-primary-intense`}
                        title={title}
                      >
                        <item.icon className={`h-4 w-4 ${iconClassName}`} />
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="flex flex-shrink-0 items-center gap-6 py-8 pl-8 md:justify-end md:py-0 md:pl-10">
              <OpenSourceButton className="hidden min-[816px]:block" />
              <a
                href={`${process.env.NEXT_PUBLIC_SIGNIN_URL}?ref=nav`}
                className={`hover:primary-intense flex-shrink-0 text-sm font-medium text-basis/90 transition-all duration-150
                  md:hidden min-[880px]:inline`}
              >
                Sign In
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=nav`}
                className="flex flex-shrink-0 items-center gap-1 rounded-md bg-cta py-2 pl-5 pr-4 text-sm font-medium text-onContrast transition-all hover:bg-ctaHover"
              >
                Sign Up
                <RiArrowRightLine className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}

const repos = [
  "inngest/inngest",
  "inngest/inngest-js",
  "inngest/inngest-py",
  "inngest/inngestgo",
  "inngest/inngest-kt",
  "inngest/agent-kit",
  "inngest/workflow-kit",
];

function OpenSourceButton({ className = "" }: { className?: string }) {
  const items = repos.map((repo) => ({
    href: `https://github.com/${repo}`,
    text: repo,
    target: "_blank",
  }));
  return (
    <Dropdown
      title={
        <>
          <span className="hidden lg:inline">Open Source</span>
          <RiGithubFill className="h-4 w-4 shrink-0" />
          <span>{(githubStars / 1000).toFixed(1)}K</span>
        </>
      }
      items={items}
      className={className}
    />
  );
}
