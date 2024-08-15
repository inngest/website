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
        d="M4.3999 3.89999H11.5999V11.1H4.3999V3.89999ZM4.3999 12.9H11.5999V20.1H4.3999V12.9ZM13.3999 3.89999H20.5999V11.1H13.3999V3.89999ZM13.3999 12.9H20.5999V20.1H13.3999V12.9ZM15.1999 5.69999V9.29999H18.7999V5.69999H15.1999ZM15.1999 14.7V18.3H18.7999V14.7H15.1999ZM6.1999 5.69999V9.29999H9.7999V5.69999H6.1999ZM6.1999 14.7V18.3H9.7999V14.7H6.1999Z"
        className="fill-primary"
      />
    </svg>
  );
}

export default SvgComponent;
