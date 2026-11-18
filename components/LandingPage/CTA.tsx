import { Button } from "components/RedesignedLanding/Button";
import Link from "next/link";
import { refLinkProps } from "@/utils/v1/ref";

export default function CTA({ href, text }: { href: string; text: string }) {
  return (
    <div className="flex items-center justify-center">
      <Button variant="default" asChild>
        <Link {...refLinkProps(href)}>{text}</Link>
      </Button>
    </div>
  );
}
