import type { SVGProps } from "react";

export const ArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M9 2.25a.75.75 0 0 1 .53.22l4.5 4.5a.75.75 0 0 1-1.06 1.06L9.75 4.81V15a.75.75 0 0 1-1.5 0V4.81L5.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5A.75.75 0 0 1 9 2.25"
      clipRule="evenodd"
    />
  </svg>
);
