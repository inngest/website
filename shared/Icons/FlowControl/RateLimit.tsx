import React from "react";
import type { IconProps } from "../props";

const RateLimit = ({
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
      <path d="M24.5 14L32.5 22" stroke={fill} strokeWidth="1.5" />
      <path d="M32.5 14L24.5 22" stroke={fill} strokeWidth="1.5" />
      <path d="M14 14L22 22" stroke={fill} strokeWidth="1.5" />
      <path d="M22 14L14 22" stroke={fill} strokeWidth="1.5" />
      <path d="M11.5 14.5L5.5 20.5L3 18" stroke={fill} strokeWidth="1.5" />
    </svg>
  );
};

export default RateLimit;
