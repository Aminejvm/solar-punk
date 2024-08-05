import React from "react";

type TruncateTextProps = React.ComponentPropsWithoutRef<"div"> & {
  lines?: number;
};

const STYLES_TRUNCATE: React.CSSProperties = {
  overflow: "hidden",
  wordBreak: "break-all",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
};

export const TruncateText: React.FC<TruncateTextProps> = ({
  children,
  style,
  lines = 1,
  ...props
}: TruncateTextProps) => {
  return (
    <div
      style={{
        ...style,
        ...STYLES_TRUNCATE,
        WebkitLineClamp: lines,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
