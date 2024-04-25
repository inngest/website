import React from "react";
import type { IconProps } from "../props";

const Idempotency = ({
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
        fill-rule="evenodd"
        clipRule="evenodd"
        d="M15.9441 18.75C15.9809 18.5054 16 18.2549 16 18C16 17.7451 15.9809 17.4946 15.9441 17.25H20.0559C20.0191 17.4946 20 17.7451 20 18C20 18.2549 20.0191 18.5054 20.0559 18.75L15.9441 18.75ZM6.05588 18.75L3 18.75C2.58579 18.75 2.25 18.4142 2.25 18C2.25 17.5858 2.58579 17.25 3 17.25H6.05588C6.01907 17.4946 6 17.7451 6 18C6 18.2549 6.01907 18.5054 6.05588 18.75ZM30 18C30 18.2549 29.9809 18.5054 29.9441 18.75L33 18.75C33.4142 18.75 33.75 18.4142 33.75 18C33.75 17.5858 33.4142 17.25 33 17.25L29.9441 17.25C29.9809 17.4946 30 17.7451 30 18Z"
        fill={fill}
      />
      <circle cx="25" cy="18" r="4.25" stroke={fill} strokeWidth="1.5" />
      <circle cx="11" cy="18" r="4.25" stroke={fill} strokeWidth="1.5" />
      <path d="M5 12L17 24" stroke={fill} strokeWidth="1.5" />
      <path d="M17 12L5 24" stroke={fill} strokeWidth="1.5" />
    </svg>
  );
};

export default Idempotency;
