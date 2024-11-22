import React from "react";
import type { IconProps } from "../props";

const Concurrency = ({
  size = "1em",
  fill = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.6798 11.75C21.7259 11.5071 21.75 11.2563 21.75 11C21.75 10.7437 21.7259 10.4929 21.6798 10.25L31.75 10.25C32.1642 10.25 32.5 10.5858 32.5 11C32.5 11.4142 32.1642 11.75 31.75 11.75L21.6798 11.75ZM13.8202 11.75L3.75 11.75C3.33579 11.75 3 11.4142 3 11C3 10.5858 3.33579 10.25 3.75 10.25L13.8202 10.25C13.7741 10.4929 13.75 10.7437 13.75 11C13.75 11.2563 13.7741 11.5071 13.8202 11.75Z"
        fill={fill === "currentColor" ? fill : undefined}
        className={`fill-${fill ? fill : "primary"}`}
      />
      <circle
        cx="17.75"
        cy="11"
        r="3.25"
        stroke={fill === "currentColor" ? fill : undefined}
        className={`stroke-${fill ? fill : "primary"}`}
        strokeWidth="1.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.6798 25.75C21.7259 25.5071 21.75 25.2563 21.75 25C21.75 24.7437 21.7259 24.4929 21.6798 24.25L31.75 24.25C32.1642 24.25 32.5 24.5858 32.5 25C32.5 25.4142 32.1642 25.75 31.75 25.75L21.6798 25.75ZM13.8202 25.75L3.75 25.75C3.33579 25.75 3 25.4142 3 25C3 24.5858 3.33579 24.25 3.75 24.25L13.8202 24.25C13.7741 24.4929 13.75 24.7437 13.75 25C13.75 25.2563 13.7741 25.5071 13.8202 25.75Z"
        fill={fill === "currentColor" ? fill : undefined}
        className={`fill-${fill ? fill : "primary"}`}
      />
      <circle
        cx="17.75"
        cy="25"
        r="3.25"
        stroke={fill === "currentColor" ? fill : undefined}
        className={`stroke-${fill ? fill : "primary"}`}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default Concurrency;
