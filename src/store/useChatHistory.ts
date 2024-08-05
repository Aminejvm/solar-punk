import FuzzySearch from "fuzzy-search";
import * as React from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { getChatHistory } from "~/queries/app/getChatHistory";
import { chatActions, Message } from "~/store/chat/slice";
import type { AppDispatch, RootState } from "~/store/store";

export const useChatDispatch: () => AppDispatch = useDispatch;
export const useChatSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useChatHistory() {
  const chatHistory = useChatSelector((state) => state.chat.history);
  const dispatch = useChatDispatch();

  React.useEffect(() => {
    if (chatHistory.messages && chatHistory.messages.length > 0) {
      return;
    }

    const controller = new AbortController();

    const fetchChatHistory = async () => {
      try {
        const response = await getChatHistory({
          signal: controller.signal,
        });

        dispatch(
          chatActions.setHistoryState({
            isLoading: false,
            messages: response.map((message) => ({
              question: message.question,
              answer: message.answer,
              basedOn: message.basedOn,
            })),
            error: null,
          }),
        );
      } catch (error) {
        if (error instanceof Error) {
          if (error?.message === "canceled") return;

          dispatch(
            chatActions.setHistoryState({
              error: error.message,
            }),
          );
        }
      }
    };

    fetchChatHistory();

    return () => {
      controller.abort();
    };
  }, [chatHistory]);

  function getChatMessage(question: string) {
    if (!chatHistory.messages) return;

    return chatHistory.messages.find(
      (message) => message.question === question,
    );
  }

  function addMessageToChatHistory(message: Message) {
    dispatch(chatActions.addMessageToHistory(message));
  }

  function searchChatHistory(query: string) {
    if (!chatHistory.messages) return;

    const searcher = new FuzzySearch(chatHistory.messages, ["question"], {
      caseSensitive: false,
    });

    return searcher.search(query);
  }

  return {
    chatHistory,
    getChatMessage,
    addMessageToChatHistory,
    searchChatHistory,
  };
}
