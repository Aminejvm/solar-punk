"use client";

import localFonts from "next/font/local";
import { cn } from "~/common/tailwind";

const abcARizona = localFonts({
  weight: "700",
  src: "../../public/fonts/abc-arizona-flare.woff2",
});

export default function Home() {
  return (
    <main className={cn("flex-1", abcARizona.className)}>
      <h1 className="text-6xl font-bold text-gray-700 text-center mt-52">
        SolarPunk
      </h1>
      <p className="text-2xl text-center text-gray-500 mt-4">
        Harnessing the power of the sun to create a better future.
      </p>
      <img
        className="mt-9 rounded-2xl border-8 border-white cursor-zoom-in max-h-full max-w-full"
        src="https://preview.redd.it/gxs1hn6lua471.jpg?auto=webp&amp;s=62bc32894f83da0378cee008ba2660d9fcb48678"
        alt="CDN media"
      />
    </main>
  );
}
