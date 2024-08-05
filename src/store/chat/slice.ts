import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnswerResponse } from "~/queries/fini/getAnswer";

export type Message = {
  question: string;
  answer: string;
  basedOn: AnswerResponse["based_on"];
};

export type ChatState = {
  history: {
    messages?: Message[];
    isLoading?: boolean;
    error?: string | null;
  };
};

const initialState: ChatState = {
  history: {
    messages: [],
    isLoading: true,
    error: null,
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setHistoryState: (state, action: PayloadAction<ChatState["history"]>) => {
      state.history = { ...state.history, ...action.payload };
    },
    addMessageToHistory: (state, action: PayloadAction<Message>) => {
      state.history = {
        ...state.history,
        messages: state.history.messages
          ? [...state.history.messages, action.payload]
          : [action.payload],
      };
    },
  },
});

export const chatReducer = chatSlice.reducer;
export const chatActions = chatSlice.actions;
