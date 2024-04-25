import NextLink, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";
import clsx from "clsx";

export default function Link(
  props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const className = clsx(
    "text-indigo-400 hover:text-indigo-200 hover:underline underline-offset-2",
    props.className
  );
  return <NextLink {...props} className={className} />;
}
