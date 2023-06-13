import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

import Container from "../layout/Container";

export default function Logos({
  heading,
  logos,
}: {
  heading: string | React.ReactNode;
  logos: { src: string; name: string; href?: string }[];
}) {
  const hasLinks = !!logos.find((l) => !!l.href);
  return (
    <Container className="my-36 mx-auto max-w-4xl">
      <h2 className="text-lg text-slate-400 drop-shadow tracking-tight text-center">
        {heading}
      </h2>
      <div
        className={clsx(
          "mt-10 flex flex-wrap lg:flex-row gap-y-8 items-center justify-center",
          hasLinks ? "gap-x-4" : "gap-x-16"
        )}
      >
        {logos.map(({ src, name, href }, idx) => {
          if (href) {
            return (
              <Link
                href={href}
                className="flex items-center justify-center h-16 w-40 px-6 py-6 rounded-lg border border-slate-900 opacity-80 hover:opacity:100 hover:border-slate-700"
              >
                <Image
                  key={idx}
                  src={src}
                  alt={name}
                  width={120}
                  height={30}
                  className="text-white max-h-[60px]"
                />
              </Link>
            );
          }
          return (
            <Image
              key={idx}
              src={src}
              alt={name}
              width={120}
              height={30}
              className="text-white max-h-[60px]"
            />
          );
        })}
      </div>
    </Container>
  );
}
