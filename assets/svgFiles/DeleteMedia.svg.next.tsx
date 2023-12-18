<svg
  xmlns="http://www.w3.org/2000/svg"
  width="40"
  height="40"
  viewBox="0 0 40 40"
  fill="none"
>
  <rect width="40" height="40" rx="20" fill="black" />
  <path
    d="M26.2783 13.7222L13.7223 26.2782"
    stroke="white"
    stroke-width="2.09266"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M13.7223 13.7222L26.2783 26.2782"
    stroke="white"
    stroke-width="2.09266"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>;

import React, { SVGProps } from "react";

const DeleteMediaIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <rect width="40" height="40" rx="20" fill="black" />
      <path
        d="M26.2783 13.7222L13.7223 26.2782"
        stroke="white"
        strokeWidth="2.09266"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.7223 13.7222L26.2783 26.2782"
        stroke="white"
        strokeWidth="2.09266"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DeleteMediaIcon;
