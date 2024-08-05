import type { SVGProps } from "react";

export const DocumentIllustration = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={129}
    height={129}
    viewBox="0 0 129 129"
    fill="none"
    {...props}
  >
    <rect width={129} height={129} fill="#fff" rx={16} />
    <rect
      width={125}
      height={125}
      x={2}
      y={2}
      stroke="#E6E6E6"
      strokeOpacity={0.5}
      strokeWidth={4}
      rx={14}
    />
    <rect
      width={64}
      height={65}
      x={33}
      y={32}
      fill="url(#document-illustration_svg__a)"
      rx={4}
    />
    <path stroke="#DAD8D8" d="M43 42.5h43.829M43 47.116h43.829" />
    <path
      stroke="#DAD8D8"
      d="M43 51.731h43.829M43 56.346h43.829M43 60.962h43.829M43 65.577h43.829M43 70.193h43.829"
    />
    <defs>
      <linearGradient
        id="document-illustration_svg__a"
        x1={65}
        x2={65}
        y1={32}
        y2={97}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EBEAEA" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
    </defs>
  </svg>
);
