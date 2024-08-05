import type { SVGProps } from "react";

export const ArrowUndoDone = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    {...props}
  >
    <path
      fill="#A5A5A5"
      d="M3.515 9.235a.375.375 0 1 1-.53.53L1.338 8.12a.875.875 0 0 1 0-1.238l1.647-1.646a.375.375 0 1 1 .53.53l-1.36 1.36h6.47c.897 0 1.625-.728 1.625-1.625v-.625c0-.897-.728-1.625-1.625-1.625h-2.75a.375.375 0 1 1 0-.75h2.75A2.375 2.375 0 0 1 11 4.875V5.5a2.375 2.375 0 0 1-2.375 2.375h-6.47z"
    />
  </svg>
);
