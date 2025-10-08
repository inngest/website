import * as React from "react";

function SvgComponent(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.0017 24V19.3463C16.9276 19.3463 20.7512 14.4612 18.8598 9.27682C18.1658 7.37179 16.6282 5.83416 14.7096 5.14018C9.52516 3.26236 4.64011 7.07243 4.64011 11.9983H0C0 4.14684 7.59292 -1.97648 15.8254 0.595316C19.4177 1.72473 22.2889 4.58228 23.4047 8.17463C25.9765 16.4071 19.8532 24 12.0017 24Z"
        fill="#000"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.0151 19.3745H7.375V14.7344H12.0151V19.3745Z"
        fill="#000"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.37574 22.9265H3.82422V19.375H7.37574V22.9265Z"
        fill="#000"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.82377 19.3706H0.84375V16.3906H3.82377V19.3706Z"
        fill="#000"
      />
    </svg>
  );
}

export default SvgComponent;
