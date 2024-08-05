import axios, { AxiosResponse } from "axios";
import * as Environment from "~/common/environment";

const INSTRUCTION =
  "Answer concisely and clearly. Don't ask me if I need additional informations, or introductions. Asnwer as if it's cited form a documentation";

export type AnswerResponse = {
  answer: string;
  answer_uuid: string;
  based_on: {
    answer: string;
    score: number;
    source_id: string;
    source_type: string;
    title: string;
  }[];
  categories: string[];
  messages: {
    content: string;
    role: "system" | "user" | "assistant";
  }[];
};

export const getAnswer = async ({
  question,
  stream = false,
}: {
  question: string;
  stream: boolean;
}): Promise<AnswerResponse | Response> => {
  const messageHistory = [{ content: INSTRUCTION, role: "system" }];

  if (!stream) {
    const response: AxiosResponse<AnswerResponse, {}> = await axios.post(
      "https://api-prod.usefini.com/v2/bots/ask-question",
      {
        question,
        stream,
        messageHistory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Environment.FINI_API_KEY}`,
        },
      },
    );

    return response.data;
  } else {
    // NOTE(amine): For streaming, return the Response object directly
    return fetch("https://api-prod.usefini.com/v2/bots/ask-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Environment.FINI_API_KEY}`,
      },
      body: JSON.stringify({
        question,
        stream,
        messageHistory,
      }),
    });
  }
};
