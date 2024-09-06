import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import Container from "../layout/Container";

export default function Logos({
  heading,
  logos,
  footer,
  variant = "dark",
  className,
}: {
  heading?: string | React.ReactNode;
  logos: {
    src: string;
    name: string;
    href?: string;
    featured?: boolean;
    scale?: number;
  }[];
  footer?: React.ReactNode;
  className?: string;
  variant?: "dark" | "light";
}) {
  const hasLinks = !!logos.find((l) => !!l.href);
  const nonFeaturedCount = logos.filter((l) => !l.featured).length;
  return (
    <Container
      className={clsx(
        "mx-auto max-w-4xl", // my-20 lg:my-36 mb-20 lg:mb-40 xl:mb-60
        className
      )}
    >
      {!!heading && (
        <h2
          className={clsx(
            "text-lg tracking-tight text-center",
            variant === "dark" && "text-slate-400 drop-shadow",
            variant === "light" && "text-slate-700"
          )}
        >
          {heading}
        </h2>
      )}
      <div
        className={clsx(
          "mt-16 grid grid-cols-4 items-center justify-center max-w-[1200px] m-auto",
          nonFeaturedCount === 4 && "sm:px-8 md:px-20 lg:grid-cols-12",
          nonFeaturedCount === 5 && "sm:px-6 lg:grid-cols-10",
          nonFeaturedCount === 6 && "sm:px-6 lg:grid-cols-12",
          hasLinks ? "gap-x-4 gap-y-8" : "gap-x-16 gap-y-16",
          footer && "mb-16"
        )}
      >
        {logos.map(({ src, name, href, featured, scale = 1 }, idx) => {
          if (href) {
            return (
              <Link
                key={idx}
                href={href}
                className={clsx(
                  "group flex items-center justify-center h-16 w-40 max-w-[90%] px-6 py-6 m-auto rounded-lg border transition-all",
                  variant === "dark" &&
                    "border-slate-700 hover:border-slate-600",
                  variant === "light" &&
                    "border-slate-200 hover:border-slate-300",
                  "col-span-2 ",
                  featured && "col-span-2",
                  !featured &&
                    nonFeaturedCount % 2 == 1 &&
                    idx === logos.length - 1 &&
                    "lg:col-span-2" // center the last item if there is an odd number
                )}
              >
                <Image
                  src={src}
                  alt={name}
                  width={120}
                  height={30}
                  className="text-white max-h-[40px] pointer-events-none opacity-80 transition-all group-hover:opacity-100"
                />
              </Link>
            );
          }
          return (
            <Image
              key={idx}
              src={src}
              alt={name}
              title={name}
              width={(featured ? 240 : 120) * scale}
              height={(featured ? 120 : 30) * scale}
              className={clsx(
                "text-white m-auto width-auto transition-all grayscale hover:grayscale-0",
                `max-h-[${36 * scale}px] col-span-2`,
                featured && "lg:col-span-4 max-h-[60px]",
                // Hide the last item if there is an odd number
                logos.length % 2 == 1 &&
                  idx === logos.length - 1 &&
                  "hidden lg:block"
              )}
            />
          );
        })}
      </div>

      {footer}
    </Container>
  );
}
