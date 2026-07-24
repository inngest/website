"use client";

import Link from "next/link";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import Button, { type ButtonVariant, type ButtonSize } from "./Button";

/**
 * `Button`-styled Next.js `<Link>`. Composes `<Button asChild>` with
 * a `<Link>` child so the anchor receives all of Button's chrome
 * (variant, size, hover effects) while behaving like a real
 * client-side link.
 *
 * Use this for in-app navigation. For external `<a>` (with
 * `target`/`rel`), mailto/tel, or Radix triggers, drop down to
 * `<Button asChild>{yourElement}</Button>` directly.
 */

type LinkProps = ComponentPropsWithoutRef<typeof Link>;

export interface ButtonLinkProps
  extends Omit<LinkProps, "className" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Wider horizontal padding for higher visual weight. */
  wide?: boolean;
  className?: string;
  children: ReactNode;
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    { variant, size, wide, className, children, href, ...linkProps },
    ref,
  ) {
    return (
      <Button asChild variant={variant} size={size} wide={wide} className={className}>
        <Link ref={ref} href={href} {...linkProps}>
          {children}
        </Link>
      </Button>
    );
  },
);

export default ButtonLink;
