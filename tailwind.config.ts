import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-snow-white":
          "linear-gradient(180deg, rgba(248, 247, 247, 0.00) 0%, #F5F4F4 15.33%)",
        "gradient-warm-orange":
          "linear-gradient(90deg, #FFECB3 1.52%, #FFD180 46.89%, #FFAB40 98.65%)",
      },
      backgroundColor: {
        "paper-white": "#F4F2F2",
        "snow-white": "#F8F7F7",
      },
      boxShadow: {
        "3xl":
          "0px 205px 57px 0px rgba(163, 163, 163, 0.00), 0px 131px 52px 0px rgba(163, 163, 163, 0.01), 0px 74px 44px 0px rgba(163, 163, 163, 0.03), 0px 33px 33px 0px rgba(163, 163, 163, 0.05), 0px 8px 18px 0px rgba(163, 163, 163, 0.06)",
        "warm-orange":
          "0px 53px 15px 0px rgba(255, 179, 77, 0.00), 0px 34px 14px 0px rgba(255, 179, 77, 0.03), 0px 19px 11px 0px rgba(255, 179, 77, 0.12), 0px 8px 8px 0px rgba(255, 179, 77, 0.20)",
      },
      animation: {
        fade: "fadeIn .3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
