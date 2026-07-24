import NextLink from "next/link";
import {
  Children,
  type ComponentProps,
  type ReactNode,
} from "react";

import { WipeLabel } from "@/components/v1/sections/shared/WipeLabel";

/**
 * v1 Link — `next/link` wrapper that auto-wraps string children in
 * `WipeLabel` (salmon left-to-right paint on hover). Rich children
 * (cards, icons) pass through unchanged. Mixed string+icon children
 * get the wipe on the string only.
 */
type V1LinkProps = ComponentProps<typeof NextLink> & {
  /** Adds the `.v1-hyperlink` animated underline. Opt-in: nav and
   *  card-wrapping links pass false; inline body links pass true. */
  underline?: boolean;
};

function wrapTextChildren(children: ReactNode): {
  wrapped: ReactNode;
  hasString: boolean;
} {
  let hasString = false;
  const wrapped = Children.map(children, (child) => {
    if (typeof child === "string") {
      hasString = true;
      return <WipeLabel>{child}</WipeLabel>;
    }
    return child;
  });
  return { wrapped, hasString };
}

export default function Link({
  children,
  className,
  underline,
  ...rest
}: V1LinkProps) {
  const { wrapped } = wrapTextChildren(children);
  const finalClassName = underline
    ? `v1-hyperlink ${className ?? ""}`.trim()
    : className;
  return (
    <NextLink {...rest} className={finalClassName}>
      {wrapped}
    </NextLink>
  );
}
