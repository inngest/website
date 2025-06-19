import FooterCTA from "./FooterCTA";
import FooterLinks, { FooterLinks2 } from "./FooterLinks";
import FooterLogo from "./FooterLogo";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-stone-950">
        <FooterCTA />
        <FooterLinks />
        <FooterLogo />
      </footer>
    </>
  );
}

export async function Footer2() {
  return (
    <>
      <footer className="relative bg-stone-950">
        <FooterCTA />
        <FooterLinks2 />
        <FooterLogo />
      </footer>
    </>
  );
}
