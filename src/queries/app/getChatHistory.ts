import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ChatHistoryResponse } from "../fini/getChatHistory";

export const getChatHistory = async (config?: AxiosRequestConfig) => {
  const response: AxiosResponse<ChatHistoryResponse, {}> = await axios.get(
    "/chat/history",
    {
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    },
  );

  return response.data;
};
