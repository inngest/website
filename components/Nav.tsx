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
        `font-circular sticky top-0 left-0 right-0 z-[100] transition-colors duration-200`
      )}
    >
      <Container className="flex justify-between items-center px-0">
        <div className="flex items-center w-full">
          <div
            className={classNames(
              menuState ? `bg-canvasBase` : ``,
              `md:bg-transparent flex items-center gap-6 py-5 md:py-0 w-full md:w-auto justify-between`
            )}
          >
            <a href="/" className="mr-4">
              <Logo className="text-basis w-20 relative top-[2px]" />
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
              `overflow-y-scroll md:overflow-visible w-full fixed bottom-0 md:bottom-auto -z-10 md:z-0 pt-[76px] md:pt-0 h-screen md:h-auto max-h-screen top-[0] left-0 right-0 bg-canvasBase md:bg-transparent md:static md:flex`
            )}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center w-full">
              <ul className="flex flex-col md:flex-row md:items-center w-full md:w-auto gap-4 md:gap-0">
                {menu.map(({ title, url, links, className = "" }, idx) =>
                  links ? (
                    <li
                      key={idx}
                      className="relative flex items-center w-full md:w-auto group text-basis/90 font-medium md:py-6 text-sm"
                    >
                      {url ? (
                        <a
                          href={`${url}?ref=nav`}
                          className={`hidden md:flex items-center text-basis/90 font-medium px-7 md:px-5 py-2 text-sm hover:text-primary-intense text-nowrap ${className}`}
                        >
                          {title}
                        </a>
                      ) : (
                        <div className="hidden md:block px-7 md:px-5 py-2 group-hover:md:text-primary-intense transition-color cursor-pointer text-nowrap">
                          {title}
                        </div>
                      )}
                      <Menu {...links} headerUrl={url} />
                    </li>
                  ) : (
                    <li key={idx}>
                      <a
                        href={`${url}?ref=nav`}
                        className={`flex items-center text-basis/90 font-medium px-7 md:px-5 py-2 text-sm hover:text-primary-intense text-nowrap ${className}`}
                      >
                        {title}
                      </a>
                    </li>
                  )
                )}
              </ul>
              <ul className="flex flex-shrink-0 items-center gap-3 mt-6 md:mt-0 px-4 md:px-3 md:hidden xl:flex">
                {iconLinks.map(
                  ({ title, url, iconClassName = "", ...item }, idx) => (
                    <li key={idx}>
                      <a
                        href={url}
                        className={`flex flex-shrink-0 items-center text-basis/90 px-3.5 py-2 hover:text-primary-intense`}
                        title={title}
                      >
                        <item.icon className={`h-4 w-4 ${iconClassName}`} />
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="pl-8 md:pl-10 py-8 md:py-0 flex gap-6 items-center md:justify-end flex-shrink-0">
              <OpenSourceButton className="hidden min-[816px]:block" />
              <a
                href={`${process.env.NEXT_PUBLIC_SIGNIN_URL}?ref=nav`}
                className={`font-medium text-sm text-basis/90 hover:primary-intense duration-150 transition-all flex-shrink-0
                  md:hidden min-[880px]:inline`}
              >
                Sign In
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=nav`}
                className="flex gap-1 items-center rounded-md text-sm font-medium pl-5 pr-4 py-2 bg-cta hover:bg-ctaHover transition-all text-onContrast flex-shrink-0"
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
