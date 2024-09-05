import Image from "next/image";
import {
  type RemixiconComponentType,
  RiArrowRightLine,
} from "@remixicon/react";

import Link from "src/components/Link";

/**
 * A feature card with an title and description with optional icon, image, and/or link.
 */
export default function Feature({
  title,
  description,
  href,
  img,
  icon,
  tight,
}: {
  title?: string | React.ReactElement;
  description: string | React.ReactElement;
  href?: string | { href: string; text: string }[];
  img?: string;
  icon?: string | RemixiconComponentType;
  tight?: boolean;
}) {
  const Icon = typeof icon === "function" ? icon : null;
  const gap = tight ? "gap-2" : "gap-4";

  return (
    <div className={`flex flex-col items-start ${gap} text-basis`}>
      {typeof icon === "function" ? (
        <Icon className="w-7 h-7 text-basis" />
      ) : typeof icon === "string" ? (
        <img src={icon} className="w-8 h-8" />
      ) : null}
      {img && (
        <Image
          src={img}
          width="512"
          height="192"
          alt={typeof title === "string" ? title : ""}
          className="rounded-md w-full mb-2"
        />
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="">{description}</p>
      {href && (
        <p className="flex flex-row flex-wrap gap-4">
          {typeof href === "string" ? (
            <Link href={href} className="inline-flex items-center gap-1.5">
              Learn more <RiArrowRightLine className="inline-flex h-4 w-4" />
            </Link>
          ) : (
            href.map(({ href, text }, idx) => (
              <Link
                key={idx}
                href={href}
                className="inline-flex items-center gap-1.5"
              >
                {text} <RiArrowRightLine className="inline-flex h-4 w-4" />
              </Link>
            ))
          )}
        </p>
      )}
    </div>
  );
}
