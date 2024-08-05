import axios, { AxiosResponse } from "axios";
import * as Environment from "~/common/environment";

type MessageRole = "system" | "user" | "assistant" | "function";

type Message = {
  role: MessageRole;
  content: string;
};

type BasedOnItem = {
  id: string;
  entry: string;
  score: number;
  title: string;
  answer: string;
  question: string;
  source_id: string;
  source_type: string;
};

export type ChatHistoryResponse = {
  botName: string;
  createdAt: number;
  source: string;
  question: string;
  answer: string;
  basedOn: BasedOnItem[];
  messageHistory: Message[];
}[];

const ONE_YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000;

export const getChatHistory = async () => {
  const endEpoch = Date.now();
  const startEpoch = endEpoch - ONE_YEAR_IN_MILLISECONDS;

  const response: AxiosResponse<ChatHistoryResponse, {}> = await axios.get(
    "https://api-prod.usefini.com/v2/bots/requests/public",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Environment.FINI_API_KEY}`,
      },
      params: {
        source: ["all"],
        endEpoch,
        startEpoch,
      },
    },
  );

  return response.data;
};
