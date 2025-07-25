import { forwardRef } from "react";
import clsx from "clsx";
import {
  motion,
  useScroll,
  useTransform,
  HTMLMotionProps,
} from "framer-motion";

import { Button } from "../Button";

import Logo from "../Icons/Logo";
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from "./MobileNavigation";
import { useMobileNavigationStore } from "./MobileNavigation";
import { ModeToggle } from "./ModeToggle";
import { HeaderSearchIcon, Search } from "./Search";
import { menuTabs } from "./navigationStructure";
import { TabItem } from "./Navigation";

function Separator() {
  return (
    <div className="hidden md:h-5 md:w-px md:bg-slate-900/10 md:dark:bg-white/15 lg:block" />
  );
}

function DocsLogo() {
  return (
    <a href="/" className="group/logo flex items-center gap-1.5 pt-1">
      <Logo className="w-24 text-black dark:text-white" />
    </a>
  );
}

export const Header = forwardRef<HTMLDivElement>(function Header(
  { className }: { className?: string },
  ref
) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore();
  let isInsideMobileNavigation = useIsInsideMobileNavigation();

  let { scrollY } = useScroll();
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9]);
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8]);

  return (
    // @ts-ignore
    <motion.div
      ref={ref}
      className={clsx(
        className,
        // NOTE - if we remove the AI button we may have to add "lg:justify-end"
        "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition lg:z-30",
        !isInsideMobileNavigation && "backdrop-blur-sm dark:backdrop-blur",
        isInsideMobileNavigation
          ? "bg-white dark:bg-carbon-900"
          : "bg-canvasBase"
      )}
      style={
        {
          "--bg-opacity-light": bgOpacityLight,
          "--bg-opacity-dark": bgOpacityDark,
        } as any
      }
    >
      <div className="flex items-center">
        <div className="flex items-center gap-5 lg:hidden">
          <MobileNavigation />
          <DocsLogo />
        </div>

        <div className="ml-2 hidden items-center space-x-4 lg:flex">
          <DocsLogo />
        </div>

        <nav className="ml-4 hidden lg:block">
          <ul role="list" className="flex items-center">
            {menuTabs.map((tab) => (
              <TabItem key={tab.title} href={tab.href} matcher={tab.matcher}>
                {tab.title}
              </TabItem>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-auto items-center justify-end space-x-4">
        <div
          className={clsx(
            "absolute inset-x-0 top-full h-px transition",
            (isInsideMobileNavigation || !mobileNavIsOpen) &&
              "bg-[rgb(var(--color-border-subtle))]"
          )}
        />

        {!isInsideMobileNavigation && <Search />}

        <div className="flex items-center gap-4">
          <Separator />
          <div className="flex items-center justify-center gap-4">
            <a href="/discord" target="_blank" className="group">
              <svg
                width={23}
                height={18}
                viewBox="0 0 71 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
                    className="fill-carbon-400 group-hover:fill-carbon-600"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect
                      width="71"
                      height="55"
                      className="fill-carbon-400 group-hover:fill-carbon-600"
                    />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <a
              href="https://github.com/inngest/"
              target="_blank"
              className="group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={18}
                height={18}
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  className="fill-carbon-400 group-hover:fill-carbon-600"
                />
              </svg>
            </a>
          </div>
          <Separator />
          <div className="flex gap-2">
            <HeaderSearchIcon />
            <ModeToggle />
          </div>
          <Separator />
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              href={`/contact?ref=docs-header`}
              size="sm"
              variant="primaryOutline"
            >
              Contact sales
            </Button>
            <Button
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=docs-header`}
              size="sm"
              variant="primaryV2"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
