"use client";
import React from "react";

export default function GlowDot() {
  return (
    <svg
      width="116"
      height="116"
      viewBox="0 0 116 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_ddd_4268_15181)">
        <rect
          width="8"
          height="8"
          transform="matrix(-1 0 0 1 61.7725 53.8804)"
          fill="#EFD27E"
        />
      </g>
      <defs>
        <filter
          id="filter0_ddd_4268_15181"
          x="0.0124626"
          y="0.120373"
          width="115.52"
          height="115.52"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="3"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_4268_15181"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4.45" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0 0.415686 0 0 0 0.45 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4268_15181"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="7.68" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0 0.415686 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_4268_15181"
            result="effect2_dropShadow_4268_15181"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="26.88" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.796078 0 0 0 0 0.698039 0 0 0 0 0.415686 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect2_dropShadow_4268_15181"
            result="effect3_dropShadow_4268_15181"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect3_dropShadow_4268_15181"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
