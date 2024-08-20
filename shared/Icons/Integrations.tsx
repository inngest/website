import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.5 18V20H19.5V22H13.5C12.3954 22 11.5 21.1046 11.5 20V18H8.5C6.29086 18 4.5 16.2091 4.5 14V6H5.5H8.5V2H10.5V6H14.5V2H16.5V6H19.5H20.5V14C20.5 16.2091 18.7091 18 16.5 18H13.5ZM8.5 16H16.5C17.6046 16 18.5 15.1046 18.5 14V11.6489H6.5V14C6.5 15.1046 7.39543 16 8.5 16ZM18.5 8H6.5V9.64894H18.5V8Z"
        className="fill-primary"
      />
    </svg>
  );
}

export default SvgComponent;
