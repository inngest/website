import React from "react";
import type { IconProps } from "../props";

const Priority = ({
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
        d="M13.9298 11.75C13.9759 11.5071 14 11.2563 14 11C14 10.7437 13.9759 10.4929 13.9298 10.25L31.75 10.25C32.1642 10.25 32.5 10.5858 32.5 11C32.5 11.4142 32.1642 11.75 31.75 11.75L13.9298 11.75ZM6.0702 11.75L3.75 11.75C3.33579 11.75 3 11.4142 3 11C3 10.5858 3.33579 10.25 3.75 10.25L6.0702 10.25C6.02411 10.4929 6 10.7437 6 11C6 11.2563 6.02411 11.5071 6.0702 11.75Z"
        fill={fill === "currentColor" ? fill : undefined}
        className={`fill-${fill ? fill : "primary"}`}
      />
      <circle
        cx="10"
        cy="11"
        r="3.25"
        stroke={fill === "currentColor" ? fill : undefined}
        className={`stroke-${fill ? fill : "primary"}`}
        strokeWidth="1.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.8202 24.25L3.75 24.25C3.33579 24.25 3 24.5858 3 25C3 25.4142 3.33579 25.75 3.75 25.75L13.8202 25.75C13.7741 25.5071 13.75 25.2564 13.75 25C13.75 24.7437 13.7741 24.493 13.8202 24.25ZM21.6798 24.25C21.7259 24.493 21.75 24.7437 21.75 25C21.75 25.2564 21.7259 25.5071 21.6798 25.75H23.5C26.1234 25.75 28.25 23.6234 28.25 21V15.6013L30.0199 17.0762C30.3381 17.3414 30.811 17.2984 31.0762 16.9802C31.3413 16.662 31.2983 16.189 30.9801 15.9239L27.9801 13.4239L27.5 13.0237L27.0199 13.4239L24.0199 15.9239C23.7017 16.189 23.6587 16.662 23.9238 16.9802C24.189 17.2984 24.6619 17.3414 24.9801 17.0762L26.75 15.6013V21C26.75 22.7949 25.2949 24.25 23.5 24.25H21.6798Z"
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

export default Priority;
