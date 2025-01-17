"use client";

import { AppProgressBar } from "next-nprogress-bar";

export const ProgressBar = () => {
  return (
    <>
      <AppProgressBar
        height="4px"
        color="#ffA500"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};
