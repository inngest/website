import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.796 9.99932L7.0835 6.28682L8.144 5.22632L12.917 9.99932L8.144 14.7723L7.0835 13.7118L10.796 9.99932Z"
        // fill="#CCCCCC"
      />
    </svg>
  );
}

export default SvgComponent;
