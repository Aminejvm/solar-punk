import * as React from "react";

import { useEventListener } from "~/common/hooks";
import { mergeEvents, mergeRefs } from "~/common/utilities";

/*---------------------------------------------------------------------------------------------
 * Combobox Provider
 * -------------------------------------------------------------------------------------------*/

type ComboboxContextValue = {
  selectedIdx: number;
  menuSelectionDisabled: boolean;
};

type ComboboxContextActions = {
  onItemSubmit?: () => void;
  setInputFocus: (focused: boolean) => void;
  registerInputRef: (node: HTMLElement | null) => void;
  registerMenuItem: (item: {
    index: number;
    onSubmitRef: React.MutableRefObject<(() => void) | undefined>;
    ref: React.RefObject<HTMLElement>;
  }) => void;
  cleanupMenuItem: (index: number) => void;
  moveSelectionOnArrowUp: () => void;
  moveSelectionOnArrowDown: () => void;
  moveSelectionOnHover: (index: number) => void;
  applySelectedElement: () => void;
  registerMenuRef: (node: HTMLElement | null) => void;
  cleanupMenu: () => void;
};

type ComboboxContextType = [ComboboxContextValue, ComboboxContextActions];

const comboboxContext = React.createContext<ComboboxContextType | undefined>(
  undefined,
);
const useComboboxContext = () => {
  const context = React.useContext(comboboxContext);
  if (!context) {
    throw new Error(
      "useComboboxContext must be used within a ComboboxProvider",
    );
  }
  return context;
};

type ComboboxProviderProps = {
  children: React.ReactNode;
  onItemSubmit?: () => void;
};

function ComboboxProvider({ children, onItemSubmit }: ComboboxProviderProps) {
  const initialIndex = 0;
  const [selectedIdx, setSelectedIdx] = React.useState(initialIndex);

  const [isInputFocused, setInputFocus] = React.useState(true);
  const menuSelectionDisabled = !isInputFocused;

  const menuItemsRef = React.useRef<
    Record<
      number,
      {
        index: number;
        onSubmitRef: React.RefObject<() => void>;
        ref: React.RefObject<HTMLElement>;
      }
    >
  >({});

  const inputElementRef = React.useRef<HTMLElement | null>(null);
  const registerInputRef = (node: HTMLElement | null) =>
    (inputElementRef.current = node);

  const registerMenuItem = ({
    index,
    onSubmitRef,
    ref,
  }: {
    index: number;
    onSubmitRef: React.RefObject<() => void>;
    ref: React.RefObject<HTMLElement>;
  }) => {
    menuItemsRef.current[index] = { index, onSubmitRef, ref };
  };
  const cleanupMenuItem = (index: number) => {
    if (menuSelectionDisabled) return;
    if (index === selectedIdx) setSelectedIdx(initialIndex);

    delete menuItemsRef.current[index];
  };

  const menuElementRef = React.useRef<HTMLElement | null>(null);
  const registerMenuRef = (node: HTMLElement | null) => {
    if (menuSelectionDisabled) return;
    menuElementRef.current = node;
  };
  const cleanupMenu = () => {
    setSelectedIdx(initialIndex);
    menuItemsRef.current = {};
    menuElementRef.current = null;
  };

  const isNavigatingViaKeyboard = React.useRef(true);
  const moveSelectionOnArrowUp = () => {
    isNavigatingViaKeyboard.current = true;
    if (menuSelectionDisabled) return;
    const prevIndex = selectedIdx - 1;
    let prevFocusedIndex = null;
    if (prevIndex >= initialIndex) {
      prevFocusedIndex = prevIndex;
    } else {
      prevFocusedIndex = Math.max(
        ...Object.keys(menuItemsRef.current).map(Number),
      );
    }
    setSelectedIdx(prevFocusedIndex);
  };

  const moveSelectionOnArrowDown = () => {
    isNavigatingViaKeyboard.current = true;
    if (menuSelectionDisabled) return;
    const nextIndex = selectedIdx + 1;
    const elementExists = !!menuItemsRef?.current?.[nextIndex];
    const nextFocusedIndex = elementExists ? nextIndex : initialIndex;
    setSelectedIdx(nextFocusedIndex);
  };

  const moveSelectionOnHover = (index: number) => {
    if (menuSelectionDisabled && !isInputFocused) {
      inputElementRef.current?.focus();
    }

    isNavigatingViaKeyboard.current = false;
    const elementExists = menuItemsRef.current[index];
    if (!elementExists) {
      console.warn(
        "Combobox: The element you're trying to select doesn't exist",
      );
      return;
    }
    setSelectedIdx(index);
  };

  const applySelectedElement = () => {
    if (menuSelectionDisabled) return;
    menuItemsRef.current[selectedIdx].onSubmitRef.current?.();
    onItemSubmit?.();
  };

  React.useLayoutEffect(() => {
    if (menuSelectionDisabled) return;

    if (!isNavigatingViaKeyboard.current) return;
    const menuNode = menuElementRef.current;
    const selectedNode = menuItemsRef.current[selectedIdx]?.ref?.current;
    if (!menuNode || !selectedNode) return;

    const menuTop = menuNode.scrollTop;
    const menuBottom = menuTop + menuNode.offsetHeight;

    const selectedNodeHeight = selectedNode.offsetHeight;
    const selectedNodeTop = selectedNode.offsetTop;
    const selectedNodeBottom = selectedNodeTop + selectedNode.offsetHeight;

    if (selectedIdx === 0) menuNode.scrollTo({ top: 0 });

    if (selectedNodeTop - selectedNodeHeight <= menuTop) {
      const nextNodeIndex = selectedIdx - 1;
      const nextNode = menuItemsRef.current[nextNodeIndex]?.ref?.current;
      if (!nextNode) return;

      menuNode.scrollTo({ top: nextNode.offsetTop });
      return;
    }

    if (selectedNodeBottom >= menuBottom) {
      menuNode.scrollTo({
        top:
          selectedNodeBottom -
          menuNode.offsetHeight +
          selectedNode.offsetHeight,
      });
    }
  }, [selectedIdx, menuSelectionDisabled]);

  const contextValue = React.useMemo(
    () => [
      { selectedIdx, menuSelectionDisabled },
      {
        onItemSubmit,

        setInputFocus,
        registerInputRef,

        registerMenuItem,
        cleanupMenuItem,

        moveSelectionOnArrowUp,
        moveSelectionOnArrowDown,
        moveSelectionOnHover,
        applySelectedElement,

        registerMenuRef,
        cleanupMenu,
      },
    ],
    [selectedIdx, menuSelectionDisabled],
  ) as ComboboxContextType;

  return (
    <comboboxContext.Provider value={contextValue}>
      {children}
    </comboboxContext.Provider>
  );
}

/*---------------------------------------------------------------------------------------------
 * Combobox Input
 * -------------------------------------------------------------------------------------------*/

type ComboboxInputProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
};

const ComboboxInput = React.forwardRef<HTMLElement, ComboboxInputProps>(
  ({ onKeyDown, onFocus, onBlur, children, ...props }, ref) => {
    const [
      ,
      {
        registerInputRef,
        setInputFocus,
        moveSelectionOnArrowUp,
        moveSelectionOnArrowDown,
        applySelectedElement,
      },
    ] = useComboboxContext();

    const keyDownHandler = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          moveSelectionOnArrowUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          moveSelectionOnArrowDown();
          break;
        case "Enter":
          e.preventDefault();
          e.stopPropagation();
          applySelectedElement();
          break;
      }
    };

    return React.cloneElement(React.Children.only(children), {
      onFocus: mergeEvents(() => setInputFocus(true), onFocus),
      onBlur: mergeEvents(() => setInputFocus(false), onBlur),
      onKeyDown: mergeEvents(
        children.props.onKeyDown,
        keyDownHandler,
        onKeyDown,
      ),
      ref: mergeRefs([ref, children.props.ref, registerInputRef]),
      ...props,
    });
  },
);

/*---------------------------------------------------------------------------------------------
 * Combobox Menu Button
 * -------------------------------------------------------------------------------------------*/

type ComboboxMenuButtonProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
  index: number;
  onSelect?: () => void;
  onSubmit?: () => void;
};

function ComboboxMenuButton({
  children,
  index,
  onSelect,
  onSubmit,
  onMouseDown,
  onClick,
  ...props
}: ComboboxMenuButtonProps) {
  const [
    { selectedIdx, menuSelectionDisabled },
    { registerMenuItem, cleanupMenuItem, moveSelectionOnHover, onItemSubmit },
  ] = useComboboxContext();
  const handleMouseDown = (e: React.MouseEvent) => e.preventDefault();
  const handleClick = () => {
    onSubmit?.();
    onItemSubmit?.();
  };

  const ref = React.useRef<HTMLElement>(null);

  const onSubmitRef = React.useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  React.useEffect(() => {
    registerMenuItem({ index, onSubmitRef: onSubmitRef, ref });
    return () => cleanupMenuItem(index);
  }, [index]);

  React.useLayoutEffect(() => {
    if (onSelect && selectedIdx === index) {
      onSelect();
    }
  }, [selectedIdx === index]);

  const handleOnMouseMove = () => {
    if (menuSelectionDisabled || selectedIdx !== index) {
      moveSelectionOnHover(index);
    }
  };

  useEventListener({
    type: "mousemove",
    handler: handleOnMouseMove,
    ref,
    options: { once: true },
  });

  return React.cloneElement(React.Children.only(children), {
    tabIndex: -1,
    onMouseDown: mergeEvents(handleMouseDown, onMouseDown),
    onMouseEnter: mergeEvents(handleOnMouseMove, children.props.onMouseEnter),
    onClick: mergeEvents(handleClick, onClick),
    ref: ref,
    ...props,
  });
}

/*---------------------------------------------------------------------------------------------
 * Combobox Menu
 * -------------------------------------------------------------------------------------------*/

type ComboboxMenuProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactElement;
};

const ComboboxMenu = React.forwardRef<HTMLElement, ComboboxMenuProps>(
  ({ children, ...props }, ref) => {
    const [, { registerMenuRef, cleanupMenu }] = useComboboxContext();

    React.useLayoutEffect(() => cleanupMenu, []);
    return React.cloneElement(React.Children.only(children), {
      ref: mergeRefs([ref, children.props.ref, registerMenuRef]),
      style: { position: "relative", ...children.props.style },
      ...props,
    });
  },
);

/* -----------------------------------------------------------------------------------------------*/

export const Combobox = {
  Provider: ComboboxProvider,
  Input: ComboboxInput,
  Menu: ComboboxMenu,
  MenuButton: ComboboxMenuButton,
};

export const useComboboxNavigation = () => {
  const [{ selectedIdx, menuSelectionDisabled }] = useComboboxContext();
  const checkIfIndexSelected = (index: number) => {
    if (menuSelectionDisabled) return false;
    return selectedIdx === index;
  };
  return { checkIfIndexSelected };
};
