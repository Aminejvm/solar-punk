import type { SVGProps } from "react";

export const ArrowTopBottom = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    {...props}
  >
    <path
      stroke="#A5A5A5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m1.75 3.5 1.646-1.647a.5.5 0 0 1 .708 0L5.75 3.5m.5 5 1.646 1.646a.5.5 0 0 0 .708 0L10.25 8.5M3.75 2v8.25m4.5-8.5V10"
    />
  </svg>
);
