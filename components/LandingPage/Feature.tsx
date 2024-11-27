import Image from "next/image";
import clsx from "clsx";
import { H3 } from "./Heading";
import Button from "./Button";
import CodeWindow from "src/shared/CodeWindow";

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
          "my-24 mx-auto grid sm:grid-cols-2 gap-24",
          // Full bleed removes the max width and moves the width constraint to the nested component
          !content.fullBleed && "max-w-[1270px]"
        )}
      >
        <div
          className={clsx(
            "flex flex-col justify-center",
            layout === "right" && "sm:order-2",
            content.fullBleed && "w-[587px] ml-auto"
          )}
        >
          <div className="flex flex-col gap-8">
            <H3>{heading}</H3>
            <p>{text}</p>
            <div className="flex flex-row">
              {ctas.map((cta, idx) => (
                <Button
                  key={idx}
                  href={cta.href}
                  variant={idx === 0 ? "primary" : "link"}
                >
                  {cta.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className={clsx(content.fullBleed && "flex flex-row justify-end")}>
          {content.code ? (
            <CodeWindow
              className="md:px-7 md:py-4"
              snippet={content.code.snippet}
              style={{
                background: `linear-gradient(108deg, rgba(204, 204, 204, 0.12) 9.67%, rgba(0, 0, 0, 0.00) 49.19%), #141414`,
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
