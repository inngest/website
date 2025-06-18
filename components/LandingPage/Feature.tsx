import Image from "next/image";
import clsx from "clsx";
import { H3 } from "./Heading";
import { Button } from "components/RedesignedLanding/Button";
import CodeWindow from "src/shared/CodeWindow";
import Link from "next/dist/client/link";

export default function Feature({
  heading,
  text,
  ctas = [],
  content,
  layout = "left",
}: {
  heading: string;
  text: string;
  ctas?: {
    href: string;
    text: string;
  }[];
  content: {
    code?: {
      snippet: string;
      language: string;
    };
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    fullBleed?: boolean;
  };
  layout?: "left" | "right";
}) {
  return (
    <div>
      <div
        className={clsx(
          "mx-auto my-24 grid gap-12 px-6 sm:grid-cols-2 sm:gap-24",
          // Full bleed removes the max width and moves the width constraint to the nested component
          !content.fullBleed && "max-w-[1270px]"
        )}
      >
        <div
          className={clsx(
            "flex flex-col justify-center",
            layout === "right" && "sm:order-2",
            content.fullBleed && "ml-auto w-[587px]"
          )}
        >
          <div className="flex flex-col gap-8">
            <H3>{heading}</H3>
            <p>{text}</p>
            <div className="flex flex-row">
              {ctas.map((cta, idx) => (
                <Button
                  key={idx}
                  variant={idx === 0 ? "default" : "link"}
                  asChild
                >
                  <Link href={cta.href}>{cta.text}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "w-full overflow-hidden",
            content.fullBleed && "flex flex-row justify-end"
          )}
        >
          {content.code ? (
            <CodeWindow
              className="md:px-7 md:py-4"
              snippet={content.code.snippet}
              style={{
                background: `bg-stone-800`,
              }}
            />
          ) : (
            content.image && (
              <Image
                alt={content.image.alt}
                src={content.image.src}
                width={content.image.width}
                height={content.image.height}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
