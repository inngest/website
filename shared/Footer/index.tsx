import NextLink from "next/link";
import Logo from "src/shared/Icons/Logo";
import Discord from "../Icons/Discord";
import Github from "../Icons/Github";
import XSocialIcon from "../Icons/XSocialIcon";
import {
  RiGithubFill,
  RiBlueskyFill,
  RiTwitterXFill,
  RiDiscordFill,
} from "@remixicon/react";
import Container from "../layout/Container";
import footerLinks from "./footerLinks";
import StatusWidget from "../StatusWidget";
import FooterCallout from "./FooterCallout";
import React from "react";

const communityLinks = [
  {
    title: "Discord",
    url: "https://www.inngest.com/discord?ref=footer",
    icon: RiDiscordFill,
  },
  {
    title: "GitHub",
    url: "https://github.com/inngest/inngest",
    icon: RiGithubFill,
  },
  {
    title: "X.com",
    url: "https://x.com/inngest",
    icon: RiTwitterXFill,
  },
  {
    title: "Bluesky",
    url: "https://bsky.app/profile/inngest.com",
    icon: RiBlueskyFill,
  },
];

export default function Footer({
  ctaRef,
  disableCta = false,
}: {
  ctaRef?: string;
  disableCta?: boolean;
}) {
  return (
    <>
      {!disableCta && (
        <div className="mt-24">
          <FooterCallout ctaRef={ctaRef} />
        </div>
      )}
      <footer className="border-t border-subtle">
        <Container className="pb-12 pt-12 lg:pt-24">
          <div className="xl:flex xl:gap-12 w-full rounded-lg relative ">
            <div className="mb-12 flex gap-6 items-start">
              <Logo className="text-basis w-20 relative top-[3px]" />
              <StatusWidget />
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap md:justify-between gap-8 lg:gap-8 xl:gap-20">
              {footerLinks.map((footerLink, i) => (
                <div className="lg:w-auto flex-shrink-0" key={i}>
                  <SectionTitle title={footerLink.name} />
                  <ul className="flex flex-col gap-4">
                    {footerLink.links.map((link, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Link href={link.url}>{link.label}</Link>
                        {link.callout && (
                          <span className="text-sm font-semibold text-primary-xIntense">
                            {link.callout}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <SectionTitle title="Community" />
                <ul className="flex flex-col gap-4">
                  {communityLinks.map((l, idx) => (
                    <li key={idx}>
                      <Link href={l.url} target="_blank">
                        <l.icon className="w-4 h-4" />
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <ul className="flex mt-12 lg:gap-6 flex-col-reverse items-start lg:flex-row text-sm">
            <li className="text-center py-1.5 text-subtle font-medium">
              &copy;
              {new Date().getFullYear()} Inngest Inc.
            </li>
            <li>
              <a
                className="text-muted py-1.5 block hover:text-primary-intense transition-colors"
                href="/privacy?ref=footer"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                className="text-muted py-1.5 block hover:text-primary-intense transition-colors"
                href="/terms?ref=footer"
              >
                Terms and Conditions
              </a>
            </li>
            <li>
              <a
                className="text-muted py-1.5 block hover:text-primary-intense transition-colors"
                href="/security?ref=footer"
              >
                Security
              </a>
            </li>
            <li>
              <a
                className="text-muted py-1.5 block hover:text-primary-intense transition-colors"
                href="/blog/soc2-compliant?ref=footer"
              >
                Inngest is SOC 2 Compliant
              </a>
            </li>
          </ul>
        </Container>
      </footer>
    </>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h4 className="text-basis text-base font-semibold mb-6">{title}</h4>;
}

function Link({
  href,
  children,
  target,
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <NextLink
      href={href}
      target={target}
      className="text-subtle text-sm font-medium flex items-center group gap-1.5 hover:text-primary-intense transition-all"
    >
      {children}
    </NextLink>
  );
}
