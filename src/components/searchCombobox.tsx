import {
  AnimationControls,
  HTMLMotionProps,
  LayoutGroup,
  motion,
  useAnimation,
} from "framer-motion";
import * as React from "react";
import { useHotkey } from "~/common/hooks";
import { cn } from "~/common/tailwind";
import { ArrowTopBottom } from "~/components/icons/arrowTopBottom";
import { ArrowUndoDone } from "~/components/icons/arrowUndoDone";
import {
  Combobox,
  useComboboxNavigation,
} from "~/components/primitives/comboboxNavigation";
import { MagnifyingGlass } from "./icons/magnifyingGlass";
import { SparklesThree } from "./icons/sparklesThree";
import { TruncateText } from "./primitives/TruncateText";

/*---------------------------------------------------------------------------------------------
 * SearchCombobox Provider
 * -------------------------------------------------------------------------------------------*/

type SearchComboboxContextType = {
  menuControls: AnimationControls;
  triggerMenuTransition: () => void;
};

const searchComboboxContext = React.createContext<
  SearchComboboxContextType | undefined
>(undefined);

export const useSearchComboboxContext = () => {
  const context = React.useContext(searchComboboxContext);
  if (!context) {
    throw new Error(
      "useSearchComboboxContext must be used within a SearchComboboxProvider",
    );
  }
  return context;
};

export function SearchAnimationProvider({
  children,
}: React.ComponentPropsWithRef<"div">) {
  const menuControls = useAnimation();
  const triggerMenuTransition = React.useCallback(() => {
    menuControls.start({
      scale: [0.96, 1],
      filter: ["blur(1px)", "blur(0px)"],
      transition: { type: "spring", stiffness: 500, damping: 50 },
    });
  }, [menuControls]);

  const contextValue = React.useMemo(
    () => ({ menuControls, triggerMenuTransition }),
    [menuControls, triggerMenuTransition],
  );

  return (
    <Combobox.Provider>
      <searchComboboxContext.Provider value={contextValue}>
        <div className="w-fit relative">{children}</div>
      </searchComboboxContext.Provider>
    </Combobox.Provider>
  );
}

/*---------------------------------------------------------------------------------------------
 * SearchCombobox Input
 * -------------------------------------------------------------------------------------------*/

export function SearchComboboxInput(
  props: React.ComponentPropsWithRef<"input">,
) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  useHotkey({
    key: "/",
    onKeyPress: () => {
      inputRef.current?.focus();
    },
  });

  return (
    <div className="relative z-10 w-fit">
      <Combobox.Input>
        <input
          ref={inputRef}
          className="relative text-sm py-3 pl-10 pr-6 rounded-2xl border border-gray-200 text-black"
          placeholder={`Type "/" to ask or search...`}
          style={{ width: 540 }}
          {...props}
        />
      </Combobox.Input>
      <MagnifyingGlass className="absolute top-1/2 left-5 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  );
}

/*---------------------------------------------------------------------------------------------
 * SearchCombobox MenuItem
 * -------------------------------------------------------------------------------------------*/

type SearchComboboxMenuItemProps = {
  index: number;
  title: string;
  description: string;
  isAiItem?: boolean;
  onClick?: () => void;
} & HTMLMotionProps<"button">;

export function SearchComboboxMenuItem({
  title,
  description,
  isAiItem,
  index,
  onClick,
  ...props
}: SearchComboboxMenuItemProps) {
  const { checkIfIndexSelected } = useComboboxNavigation();
  const isSelected = checkIfIndexSelected(index);

  const controls = useAnimation();

  const handleOnSubmit = async () => {
    controls.start({
      scale: [0.98, 1],
      transition: { duration: 0.15, ease: "easeInOut" },
    });
    onClick?.();
  };

  return (
    <Combobox.MenuButton onSubmit={handleOnSubmit} index={index}>
      <motion.button
        initial={{ scale: 1 }}
        animate={controls}
        className={cn(" flex items-center gap-3 relative py-3 px-4 rounded-xl")}
        {...props}
      >
        {isAiItem && <SparklesThree />}
        <span className="inline-flex flex-col gap-1.5 text-left">
          <span className="text-sm font-medium text-black break-all">
            {title}
          </span>
          <TruncateText>
            <span className="text-xs text-gray-600">{description}</span>
          </TruncateText>
        </span>

        {isAiItem && (
          <div className="absolute -z-10 top-0 left-0 w-full h-full rounded-xl bg-orange-50" />
        )}
        {isSelected && (
          <motion.div
            layoutId="selected"
            transition={{ type: "spring", stiffness: 500, damping: 50 }}
            className="absolute -z-10 top-0 left-0 w-full h-full rounded-xl shadow-warm-orange bg-gradient-warm-orange border-gray-100 will-change-transform"
          />
        )}
      </motion.button>
    </Combobox.MenuButton>
  );
}

/*---------------------------------------------------------------------------------------------
 * SearchCombobox Menu
 * -------------------------------------------------------------------------------------------*/

type SearchComboboxMenuProps = React.ComponentPropsWithoutRef<"div">;

export function SearchComboboxMenu({
  children,
  className,
  ...props
}: SearchComboboxMenuProps) {
  const { menuControls } = useSearchComboboxContext();

  return (
    <LayoutGroup>
      <motion.div initial={{ scale: 1 }} animate={menuControls}>
        <motion.div
          initial={{ scaleX: 0.96, opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ translateY: "100%" }}
          className="absolute z-10 w-full -bottom-3"
        >
          <motion.div className="absolute w-full h-full -z-10 rounded-2xl border border-gray-100 shadow-3xl bg-white" />
          <Combobox.Menu>
            <div
              className={cn(
                "relative w-full max-h-96 flex flex-col overflow-y-auto px-4 pt-3",
                className,
              )}
              {...props}
            >
              {children}
              <div className="sticky bg-white bottom-0 flex gap-4 px-4 py-5 mt-3 border-t border-gray-100 w-full text-black">
                <div className="flex items-center gap-2 ">
                  <ArrowTopBottom className="w-3 h-3 " />
                  <span className="text-xs">Navigate</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUndoDone className="w-3 h-3" />
                  <span className="text-xs">Submit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">esc</span>
                  <span className="text-xs">Dismiss</span>
                </div>
              </div>
            </div>
          </Combobox.Menu>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
