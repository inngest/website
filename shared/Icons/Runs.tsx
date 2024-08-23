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
        d="M6.33193 5.4H9.396V7.23844H6.33193V5.4ZM10.928 5.4H20.1202V7.23844H10.928V5.4Z"
        className="fill-primary"
      />
      <path
        d="M20.1202 16.7616H17.0562V18.6H20.1202V16.7616Z"
        className="fill-primary"
      />
      <path
        d="M15.5241 16.7616H6.33193V18.6H15.5241V16.7616Z"
        className="fill-primary"
      />
      <path
        d="M8.63013 11.1727H4.80005V13.0111H8.63013V11.1727Z"
        className="fill-primary"
      />
      <path
        d="M12.4602 11.1727H10.1622V13.0111H12.4602V11.1727Z"
        className="fill-primary"
      />
      <path
        d="M18.5883 11.1727H13.9922V13.0111H18.5883V11.1727Z"
        className="fill-primary"
      />
    </svg>
  );
}

export default SvgComponent;
