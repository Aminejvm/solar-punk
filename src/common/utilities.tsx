import React from "react";

/* -------------------------------------------------------------------------------------------------*
 * mergeEvents
 * ---------------------------------------------------------------------------------------------*/

type EventHandler<E extends React.SyntheticEvent> =
  | ((event: E) => void)
  | undefined;

export const mergeEvents = <E extends React.SyntheticEvent>(
  ...handlers: Array<EventHandler<E>>
): EventHandler<E> => {
  return (event: E) => {
    handlers.forEach((handler) => {
      if (handler) handler(event);
    });
  };
};

/* -------------------------------------------------------------------------------------------------*
 * mergeRefs
 * ---------------------------------------------------------------------------------------------*/

type Ref<T> = React.RefCallback<T> | React.MutableRefObject<T | null> | null;

export const mergeRefs = <T,>(
  refs: Array<Ref<T>>,
): React.RefCallback<T | null> => {
  return (value: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
};
