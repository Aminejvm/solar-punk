"use client";

import React from "react";
import { Logo } from "~/components/icons/logo";
import { SearchAnimationProvider } from "~/components/searchCombobox";
import { SearchInput } from "~/components/searchInput";
import { Switch } from "./primitives/Switch";

export function Header() {
  const [isStreamOn, setIsStreamOn] = React.useState(false);
  const handleStreamToggle = () => setIsStreamOn((prev) => !prev);

  return (
    <header className="flex items-center justify-between w-full pt-6">
      <a href="/">
        <Logo />
      </a>
      <SearchAnimationProvider>
        <SearchInput enableStreamAnswer={isStreamOn} />
      </SearchAnimationProvider>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Stream:</label>
        <Switch checked={isStreamOn} onChange={handleStreamToggle} />
      </div>
    </header>
  );
}
