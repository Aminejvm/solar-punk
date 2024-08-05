import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "~/store/store";

export const useChatDispatch: () => AppDispatch = useDispatch;
export const useChatSelector: TypedUseSelectorHook<RootState> = useSelector;
