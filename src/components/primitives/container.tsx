import React from "react";
import { cn } from "~/common/tailwind";

type ContainerProps = React.ComponentPropsWithRef<"main">;

export const Container = React.forwardRef(
  ({ className, ...props }: ContainerProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <main
        ref={ref}
        className={cn("max-w-7xl px-4 mx-auto", className)}
        {...props}
      />
    );
  },
);
