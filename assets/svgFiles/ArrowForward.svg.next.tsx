import React, { SVGProps } from "react";

const ArrowForwardIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.39321 2.04165C5.59457 1.84028 5.92105 1.84028 6.12241 2.04165L9.21616 5.1354C9.41753 5.33676 9.41753 5.66324 9.21616 5.8646L6.12241 8.95835C5.92105 9.15972 5.59457 9.15972 5.39321 8.95835C5.19185 8.75699 5.19185 8.43051 5.39321 8.22915L7.60673 6.01562H2.14844C1.86367 6.01562 1.63281 5.78477 1.63281 5.5C1.63281 5.21523 1.86367 4.98438 2.14844 4.98438H7.60673L5.39321 2.77085C5.19185 2.56949 5.19185 2.24301 5.39321 2.04165Z"
        fill={props.fill}
      />
    </svg>
  );
};

export default ArrowForwardIcon;
