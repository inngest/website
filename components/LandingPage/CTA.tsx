import { Button } from "components/RedesignedLanding/Button";
import Link from "next/link";

export default function CTA({ href, text }: { href: string; text: string }) {
  return (
    <div className="flex items-center justify-center">
      <Button variant="default" asChild>
        <Link href={href}>{text}</Link>
      </Button>
    </div>
  );
}
