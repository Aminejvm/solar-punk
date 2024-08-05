import type { SVGProps } from "react";

export const BrowserIllustration = (props: SVGProps<SVGSVGElement>) => (
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
      width={87}
      height={52.819}
      x={24}
      y={36.567}
      fill="url(#browser-illustration_svg__a)"
      rx={4}
    />
    <path
      stroke="#BEBCBC"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M68.686 58.977c-.758-.681-1.987-.681-2.745 0l-1.373 1.233c-.758.681-.758 1.786 0 2.467.759.68 1.988.68 2.746 0L68 62.06"
    />
    <path
      stroke="#BEBCBC"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M67.314 60.21c.758.681 1.987.681 2.745 0l1.373-1.233c.757-.68.757-1.785 0-2.466-.759-.681-1.988-.681-2.746 0l-.686.616"
    />
    <path
      fill="#D9D9D9"
      d="M24 40.567a4 4 0 0 1 4-4h79a4 4 0 0 1 4 4v2.094H24z"
    />
    <circle cx={34} cy={40} r={1} fill="#FCFACB" />
    <circle cx={30} cy={40} r={1} fill="#EBB" />
    <circle cx={38} cy={40} r={1} fill="#E1FCD7" />
    <defs>
      <linearGradient
        id="browser-illustration_svg__a"
        x1={67.5}
        x2={67.5}
        y1={36.567}
        y2={89.386}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.22} stopColor="#EBEAEA" />
        <stop offset={0.796} stopColor="#F6F5F5" />
        <stop offset={1} stopColor="#fff" />
      </linearGradient>
    </defs>
  </svg>
);
