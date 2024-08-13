import { forwardRef } from "react";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";

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
    <div className="hidden lg:block md:h-5 md:w-px md:bg-slate-900/10 md:dark:bg-white/15" />
  );
}

function DocsLogo() {
  return (
    <a href="/docs" className="flex gap-1.5 group/logo items-center pt-1">
      <Logo className="w-20 text-indigo-500 dark:text-white" />
      {/* <span className="mb-0.5 text-slate-700 dark:text-indigo-400 text-base group-hover/logo:text-slate-500 dark:group-hover/logo:text-white transition-color font-semibold">
        Docs
      </span> */}
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
    <motion.div
      ref={ref}
      className={clsx(
        className,
        // NOTE - if we remove the AI button we may have to add "lg:justify-end"
        "fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition lg:z-30",
        !isInsideMobileNavigation && "backdrop-blur-sm dark:backdrop-blur",
        isInsideMobileNavigation
          ? "bg-white dark:bg-slate-900"
          : "bg-white/[var(--bg-opacity-light)] dark:bg-slate-950/[var(--bg-opacity-dark)]"
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

        <div className="hidden lg:flex items-center space-x-4 ml-2">
          <DocsLogo />
          <Separator />
        </div>

        <nav className="hidden lg:block ml-4">
          <ul role="list" className="flex items-center">
            {menuTabs.map((tab) => (
              <TabItem key={tab.title} href={tab.href} matcher={tab.matcher}>
                {tab.title}
              </TabItem>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex items-center justify-end flex-auto space-x-4">
        <div
          className={clsx(
            "absolute inset-x-0 top-full h-px transition",
            (isInsideMobileNavigation || !mobileNavIsOpen) &&
              "bg-slate-900/7.5 dark:bg-white/7.5"
          )}
        />

        {!isInsideMobileNavigation && <Search />}

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Button
              href={`${process.env.NEXT_PUBLIC_SIGNUP_URL}?ref=docs-header`}
              size="sm"
              arrow="right"
            >
              Sign Up
            </Button>
          </div>
          <Separator />
          <div className="flex gap-2">
            <HeaderSearchIcon />
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
