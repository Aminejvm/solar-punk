import * as React from "react";

/* -------------------------------------------------------------------------------------------------*
 * useEventListener
 * ---------------------------------------------------------------------------------------------*/

type UseEventListenerOptions<T extends EventTarget = EventTarget> = {
  type: string;
  handler: (event: Event) => void;
  ref?: React.RefObject<T>;
  options?: AddEventListenerOptions;
  enabled?: boolean;
};

export const useEventListener = <T extends EventTarget = EventTarget>({
  type,
  handler,
  ref,
  options,
  enabled = true,
}: UseEventListenerOptions<T>) => {
  const savedHandler = React.useRef<(event: Event) => void>();

  React.useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  React.useEffect(() => {
    if (!enabled) return;

    let element: T | Window = window;
    if (ref && ref.current) element = ref.current;

    if (!element) return;

    const eventListener = (event: Event) => savedHandler.current?.(event);

    element.addEventListener(type, eventListener, options);
    return () => element.removeEventListener(type, eventListener, options);
  }, [type, enabled, ref, options]);
};

/* -------------------------------------------------------------------------------------------------*
 * useHotKey
 * ---------------------------------------------------------------------------------------------*/

type UseHotkeyOptions = {
  key: string;
  onKeyPress: () => void;
  enabled?: boolean;
};

export const useHotkey = ({
  key,
  onKeyPress,
  enabled = true,
}: UseHotkeyOptions) => {
  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        onKeyPress();
      }
    },
    [key, onKeyPress],
  );

  useEventListener({
    type: "keydown",
    handler: handleKeyPress as (event: Event) => void,
    enabled,
  });
};

/* -------------------------------------------------------------------------------------------------*
 * useEscapeKey
 * ---------------------------------------------------------------------------------------------*/

type UseEscapeKeyOptions = {
  onEscape: () => void;
  enabled?: boolean;
};

export const useEscapeKey = ({
  onEscape,
  enabled = true,
}: UseEscapeKeyOptions) => {
  useHotkey({
    key: "Escape",
    onKeyPress: onEscape,
    enabled,
  });
};
