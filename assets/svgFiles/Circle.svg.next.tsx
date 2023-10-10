import React, { SVGProps } from "react";

const CircleIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
      {...props}
    >
      <circle cx="4.5" cy="4.5" r="4" fill={props.fill} stroke="white" />
    </svg>
  );
};

export default CircleIcon;
