import Button from "./Button";

export default function CTA({ href, text }: { href: string; text: string }) {
  return (
    <div className="flex items-center justify-center">
      <Button href={href} variant="primary">
        {text}
      </Button>
    </div>
  );
}
