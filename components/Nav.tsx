"use client";
import { useState, useEffect } from "react";
import {
  RiMenuLine,
  RiCloseLine,
  RiGithubFill,
  RiDiscordFill,
  RiTwitterXFill,
  RiArrowRightLine,
} from "@remixicon/react";
import Logo from "src/shared/Icons/Logo";
import classNames from "src/utils/classNames";
import Container from "src/shared/layout/Container";
import Menu, { type MenuProps } from "./Nav/Menu";
import { productLinks, resourcesLinks } from "./Nav/links";

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
  },
  {
    title: "Case Studies",
    url: "/customers",
    className: "md:hidden lg:flex", // Hide on md
  },
  {
    title: "Pricing",
    url: "/pricing",
  },
  {
    title: "Blog",
    url: "/blog",
  },
];

const iconLinks: {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
}[] = [
  {
    title: "Github",
    url: "https://github.com/inngest/inngest",
    icon: RiGithubFill,
    iconClassName: "scale-110",
  },
  {
    title: "Discord",
    url: "/discord",
    icon: RiDiscordFill,
    iconClassName: "scale-125",
  },
  {
    title: "X",
    url: "https://twitter.com/inngest",
    icon: RiTwitterXFill,
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
              `md:bg-transparent flex items-center py-5 md:py-0 w-full md:w-auto justify-between`
            )}
          >
            <a href="/" className="mr-4">
              <Logo className="text-basis w-20 relative top-[2px]" />
            </a>
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
                {menu.map(({ title, url, links, className = "" }) =>
                  links ? (
                    <li className="relative flex items-center w-full md:w-auto group text-basis/90 font-medium md:px-5 md:py-8 text-sm">
                      <span className="hidden md:block group-hover:md:text-primary-intense transition-color cursor-pointer">
                        {title}
                      </span>
                      <Menu {...links} />
                    </li>
                  ) : (
                    <li>
                      <a
                        href={`${url}?ref=nav`}
                        className={`flex items-center text-basis/90 font-medium px-7 md:px-5 py-2 text-sm hover:text-primary-intense ${className}`}
                      >
                        {title}
                      </a>
                    </li>
                  )
                )}
              </ul>
              <ul className="flex flex-shrink-0 md:items-center gap-3 mt-6 md:mt-0 md:px-3 md:hidden xl:flex">
                {iconLinks.map(
                  ({ title, url, iconClassName = "", ...item }) => (
                    <li>
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
            <div className="pl-8 md:pl-10 py-8 md:py-0 flex gap-6 items-center md:w-1/3 md:justify-end flex-shrink-0">
              <a
                href={`${process.env.NEXT_PUBLIC_SIGNIN_URL}?ref=nav`}
                className="font-medium text-sm text-basis/90 hover:primary-intense duration-150 transition-all flex-shrink-0"
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
