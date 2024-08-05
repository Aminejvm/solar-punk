import React from "react";
import { cn } from "~/common/tailwind";

type SwitchProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-block w-10 h-5 cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={cn(
          "w-full h-full rounded-full shadow-inner transition-colors duration-300 ease-in-out ",
          checked ? "bg-orange-500" : "bg-gray-300",
        )}
      >
        <div
          className={cn(
            "absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </div>
    </label>
  );
};
