import React from "react";
import type { IconProps  } from "./props";

const Elixir = ({
  size = "1em",
  fill = "currentColor",
  className
}: IconProps) => {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M57.221,24.648c7.321,15.719,26.377,22.286,24.654,42.742c-2.029,24.092-19.164,30.145-28.638,30.576
	c-9.474,0.431-27.561-2.907-32.514-25.623C15.161,46.828,39.456,7.638,53.452,2.039C52.914,8.391,54.271,18.316,57.221,24.648z
	 M44.761,89.69c6.407,1.331,11.317,2.256,11.899-0.324c0.877-3.884-14.063-6.075-24.049-7.156
	C35.608,85.372,41.659,89.045,44.761,89.69z" fill={fill} />
    </svg>
  )
}

export default Elixir;