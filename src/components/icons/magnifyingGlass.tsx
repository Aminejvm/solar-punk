import type { SVGProps } from "react";

export const MagnifyingGlass = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      stroke="#AAA"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m13.674 14.167-2.8-2.8m1.467-3.534a5 5 0 1 1-10 0 5 5 0 0 1 10 0"
    />
  </svg>
);
