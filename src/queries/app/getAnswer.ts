import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AnswerResponse } from "~/queries/fini/getAnswer";

export const getAnswer = async ({
  question,
  stream = false,
  onChunk,
  signal,
}: {
  question: string;
  signal?: AbortSignal;
  stream?: boolean;
  onChunk?: (chunk: string) => void;
} & AxiosRequestConfig): Promise<AnswerResponse | void> => {
  if (!stream) {
    const response: AxiosResponse<AnswerResponse, {}> = await axios.post(
      "/chat/answer",
      { question, stream },
      { headers: { "Content-Type": "application/json" }, signal },
    );
    return response.data;
  }

  // Streaming response handling
  const response = await fetch("/chat/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
    body: JSON.stringify({ question, stream }),
  });

  if (!response.ok || !response.body) {
    throw new Error(response.statusText);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const decodedChunk = decoder.decode(value, { stream: true });
    onChunk?.(decodedChunk);
  }
};
