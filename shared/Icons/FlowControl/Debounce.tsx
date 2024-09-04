import React from "react";
import type { IconProps } from "../props";

const Debounce = ({
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
        d="M29.6798 9.75C29.7259 9.50706 29.75 9.25635 29.75 9C29.75 8.74365 29.7259 8.49294 29.6798 8.25L31.75 8.25C32.1642 8.25 32.5 8.58579 32.5 9C32.5 9.41422 32.1642 9.75 31.75 9.75L29.6798 9.75ZM21.8202 9.75L3.75 9.75C3.33579 9.75 3 9.41421 3 9C3 8.58579 3.33579 8.25 3.75 8.25L21.8202 8.25C21.7741 8.49294 21.75 8.74365 21.75 9C21.75 9.25635 21.7741 9.50706 21.8202 9.75Z"
        fill={fill === "currentColor" ? fill : undefined}
        className={`fill-${fill ? fill : "primary"}`}
      />
      <circle
        cx="25.75"
        cy="9"
        r="3.25"
        stroke={fill === "currentColor" ? fill : undefined}
        className={`stroke-${fill ? fill : "primary"}`}
        stroke-width="1.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.8202 27.75C5.77411 27.5071 5.75 27.2563 5.75 27C5.75 26.7437 5.77411 26.4929 5.8202 26.25L3.75 26.25C3.33579 26.25 3 26.5858 3 27C3 27.4142 3.33579 27.75 3.75 27.75L5.8202 27.75ZM13.6798 27.75L31.75 27.75C32.1642 27.75 32.5 27.4142 32.5 27C32.5 26.5858 32.1642 26.25 31.75 26.25L13.6798 26.25C13.7259 26.4929 13.75 26.7437 13.75 27C13.75 27.2563 13.7259 27.5071 13.6798 27.75Z"
        fill={fill === "currentColor" ? fill : undefined}
        className={`fill-${fill ? fill : "primary"}`}
      />
      <circle
        cx="4"
        cy="4"
        r="3.25"
        transform="matrix(-1 0 0 1 13.75 23)"
        stroke={fill === "currentColor" ? fill : undefined}
        className={`stroke-${fill ? fill : "primary"}`}
        stroke-width="1.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.6798 18.75C21.7259 18.5071 21.75 18.2563 21.75 18C21.75 17.7437 21.7259 17.4929 21.6798 17.25L31.75 17.25C32.1642 17.25 32.5 17.5858 32.5 18C32.5 18.4142 32.1642 18.75 31.75 18.75L21.6798 18.75ZM13.8202 18.75L3.75 18.75C3.33579 18.75 3 18.4142 3 18C3 17.5858 3.33579 17.25 3.75 17.25L13.8202 17.25C13.7741 17.4929 13.75 17.7437 13.75 18C13.75 18.2563 13.7741 18.5071 13.8202 18.75Z"
        fill={fill === "currentColor" ? fill : undefined}
        className={`fill-${fill ? fill : "primary"}`}
      />
      <circle
        cx="17.75"
        cy="18"
        r="3.25"
        stroke={fill === "currentColor" ? fill : undefined}
        className={`stroke-${fill ? fill : "primary"}`}
        stroke-width="1.5"
      />
    </svg>
  );
};

export default Debounce;
