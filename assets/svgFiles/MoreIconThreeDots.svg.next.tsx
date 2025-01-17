import React, { SVGProps } from "react";

const MoreIconThreeDots = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="30"
      viewBox="0 0 24 30"
      fill="none"
      {...props}
    >
      <path
        d="M12.0769 17.0769C13.224 17.0769 14.1538 16.1471 14.1538 15C14.1538 13.8529 13.224 12.9231 12.0769 12.9231C10.9299 12.9231 10 13.8529 10 15C10 16.1471 10.9299 17.0769 12.0769 17.0769Z"
        fill="#343D45"
      />
      <path
        d="M12.0769 24C13.224 24 14.1538 23.0701 14.1538 21.9231C14.1538 20.776 13.224 19.8462 12.0769 19.8462C10.9299 19.8462 10 20.776 10 21.9231C10 23.0701 10.9299 24 12.0769 24Z"
        fill="#343D45"
      />
      <path
        d="M12.0769 10.1538C13.224 10.1538 14.1538 9.22398 14.1538 8.07692C14.1538 6.92987 13.224 6 12.0769 6C10.9299 6 10 6.92987 10 8.07692C10 9.22398 10.9299 10.1538 12.0769 10.1538Z"
        fill="#343D45"
      />
    </svg>
  );
};

export default MoreIconThreeDots;
