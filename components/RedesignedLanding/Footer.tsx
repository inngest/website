import FooterCTA from "./FooterCTA";
import FooterLinks from "./FooterLinks";
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
