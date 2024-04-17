import React from "react";
import type { IconProps } from "../props";

const Batching = ({
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
      <rect
        x="5.25"
        y="5.25"
        width="25.5"
        height="25.5"
        rx="1.75"
        stroke={fill}
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="13" cy="13" r="3.25" stroke={fill} strokeWidth="1.5" />
      <circle cx="23" cy="13" r="3.25" stroke={fill} strokeWidth="1.5" />
      <circle cx="23" cy="23" r="3.25" stroke={fill} strokeWidth="1.5" />
      <circle cx="13" cy="23" r="3.25" stroke={fill} strokeWidth="1.5" />
    </svg>
  );
};

export default Batching;
