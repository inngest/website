import NextLink, { type LinkProps } from "next/link";
import { AnchorHTMLAttributes } from "react";
import clsx from "clsx";

export default function Link(
  props: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const className = clsx(
    "hover:underline underline-offset-2",
    props.color ? props.color : "text-link",
    props.className
  );
  return <NextLink {...props} className={className} />;
}
