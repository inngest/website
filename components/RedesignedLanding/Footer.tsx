"use client";

import { usePathname } from "next/navigation";
import FooterCTA from "./FooterCTA";
import FooterLinks from "./FooterLinks";
import FooterLogo from "./FooterLogo";

export default function Footer() {
  const pathname = usePathname();
  const isReportPage = pathname?.startsWith("/2026-durable-execution-report");

  return (
    <>
      <footer className="relative bg-stone-950">
        {!isReportPage && <FooterCTA />}
        <FooterLinks />
        <FooterLogo />
      </footer>
    </>
  );
}
