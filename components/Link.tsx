import NextLink, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";
import clsx from "clsx";

export default function Link(
  props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const className = clsx(
    "underline text-indigo-500 hover:text-indigo-400 underline-offset-2",
    props.className
  );
  return <NextLink {...props} className={className} />;
}
