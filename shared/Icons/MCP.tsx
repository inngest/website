import React from "react";
import type { IconProps } from "./props";

// TanStack Start icon using the official TanStack brand logo
// Uses fill={fill} (defaulting to currentColor) so it adapts to light/dark themes via CSS
const SkillsMDIcon = ({
  size = "1em",
  fill = "currentColor",
  className,
}: IconProps) => {
  return (
    <svg
      height={size}
      width={size}
      className={className}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_14_20)">
        <mask
          id="mask0_14_20"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="180"
        >
          <path d="M180 0H0V180H180V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_14_20)">
          <path
            d="M18 84.8528L85.8822 16.9706C95.2548 7.59801 110.451 7.59801 119.823 16.9706C129.196 26.3431 129.196 41.5391 119.823 50.9117L68.5581 102.177"
            stroke={fill}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M69.2652 101.47L119.823 50.9118C129.196 41.5392 144.392 41.5392 153.765 50.9118L154.118 51.2653C163.491 60.6379 163.491 75.8339 154.118 85.2064L92.7248 146.6C89.6006 149.724 89.6006 154.789 92.7248 157.913L105.331 170.52"
            stroke={fill}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M102.853 33.9412L52.6482 84.1458C43.2756 93.5184 43.2756 108.714 52.6482 118.087C62.0208 127.459 77.2167 127.459 86.5893 118.087L136.794 67.8823"
            stroke={fill}
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_14_20">
          <rect width="180" height="180" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SkillsMDIcon;
