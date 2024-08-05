import { AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEscapeKey } from "~/common/hooks";
import { cn } from "~/common/tailwind";
import { SparklesThree } from "~/components/icons/sparklesThree";
import { LoadingSkeleton } from "~/components/primitives/loadingSkeleton";
import {
  SearchComboboxInput,
  SearchComboboxMenu,
  SearchComboboxMenuItem,
  useSearchComboboxContext,
} from "~/components/searchCombobox";
import { getAnswer } from "~/queries/app/getAnswer";
import { AnswerResponse } from "~/queries/fini/getAnswer";
import { useChatHistory } from "~/store/useChatHistory";

const inter = Inter({ subsets: ["latin"] });

enum SEARCH_NAIGATION_TYPES {
  INITIAL = "initial",
  ANSWER = "answer",
  AI = "ai",
}

type SEARCH_NAVIGATION_STATE =
  | { type: SEARCH_NAIGATION_TYPES.INITIAL }
  | { type: SEARCH_NAIGATION_TYPES.ANSWER }
  | { type: SEARCH_NAIGATION_TYPES.AI };

type SearchInputProps = {
  enableStreamAnswer?: boolean;
};

export function SearchInput({ enableStreamAnswer = false }: SearchInputProps) {
  const [query, setQuery] = React.useState("");
  const handleQueryChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  const [navigation, setNavigation] = React.useState<SEARCH_NAVIGATION_STATE>({
    type: SEARCH_NAIGATION_TYPES.INITIAL,
  });

  const handleNavigation = (nav: SEARCH_NAVIGATION_STATE) => {
    setNavigation(nav);
    if (nav.type === SEARCH_NAIGATION_TYPES.ANSWER) {
      setQuery("");
    }
  };

  React.useLayoutEffect(() => {
    if (navigation.type !== SEARCH_NAIGATION_TYPES.INITIAL) {
      setNavigation({ type: SEARCH_NAIGATION_TYPES.INITIAL });
    }
  }, [query]);

  const { triggerMenuTransition } = useSearchComboboxContext();

  React.useLayoutEffect(() => {
    if (query) {
      triggerMenuTransition();
    }
  }, [navigation.type]);

  const handleEscapeKeyDown = () => {
    if (navigation.type !== SEARCH_NAIGATION_TYPES.INITIAL) {
      setNavigation({ type: SEARCH_NAIGATION_TYPES.INITIAL });
      return;
    }
    setQuery("");
  };

  useEscapeKey({
    onEscape: handleEscapeKeyDown,
    enabled: query.length > 0,
  });

  return (
    <>
      <SearchComboboxInput value={query} onChange={handleQueryChange} />
      <AnimatePresence>
        {query && (
          <SearchComboboxMenu>
            {navigation.type === SEARCH_NAIGATION_TYPES.INITIAL && (
              <SearchMenuItems query={query} onItemSelect={handleNavigation} />
            )}
            {navigation.type === SEARCH_NAIGATION_TYPES.AI &&
              (enableStreamAnswer ? (
                <SearchMenuGenerateStreamAnswer query={query} />
              ) : (
                <SearchMenuGenerateAnswer query={query} />
              ))}
          </SearchComboboxMenu>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchMenuGenerateStreamAnswer({ query }: { query: string }) {
  const [streamedAnswers, setStreamedAnswers] = React.useState<string[]>([]);
  const { addMessageToChatHistory } = useChatHistory();
  const [metadata, setMetadata] =
    React.useState<Pick<AnswerResponse, "based_on">>();

  React.useLayoutEffect(() => {
    const controller = new AbortController();

    async function fetchStreamingData() {
      setStreamedAnswers([]);

      try {
        let metadataBuffer = "";
        let isMetadata = true;
        let metadata: Pick<AnswerResponse, "based_on"> | undefined;

        await getAnswer({
          question: query,
          stream: true,
          signal: controller.signal,
          onChunk: (chunk: string) => {
            const lines = chunk
              .split("\n")
              .filter((line) => line.trim() !== "");

            lines.forEach((line) => {
              if (line.startsWith("data: {")) {
                const jsonStr = line.slice(6); // Remove 'data: ' prefix
                try {
                  const jsonObj = JSON.parse(jsonStr);

                  if (isMetadata) {
                    metadataBuffer += jsonStr;
                    if (jsonStr.endsWith("}")) {
                      // Metadata object is complete
                      isMetadata = false;
                      metadata = JSON.parse(metadataBuffer);
                      setMetadata(metadata);
                      metadataBuffer = "";
                    }
                  } else if ("content" in jsonObj) {
                    setStreamedAnswers((prev) => [...prev, jsonObj.content]);
                  }
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                }
              }
            });
          },
        });

        addMessageToChatHistory({
          question: query,
          answer: streamedAnswers.join("\n"),
          basedOn: metadata?.based_on as AnswerResponse["based_on"],
        });
      } catch (error) {
        if (error instanceof Error) {
          if (error?.message === "canceled") return;
          console.error("Error fetching streaming data:", error);
        }
      }
    }

    fetchStreamingData();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-4">
        <SparklesThree />
        <div className="flex flex-col ">
          <h1 className="text-black text-base font-medium">{query}</h1>
          <p className="text-gray-800 text-xs">Powered by usefini.com</p>
        </div>
      </div>

      {streamedAnswers.length === 0 ? (
        <div className="flex flex-col gap-3 py-3 px-4">
          <LoadingSkeleton className="w-full origin-left" />
        </div>
      ) : (
        <div>
          <pre
            className={cn(
              "whitespace-pre-wrap text-sm text-gray-800 m-0 leading-6 animate-fade py-3 px-4 border-t border-neutral-200 border-dotted",
              inter.className,
            )}
          >
            {streamedAnswers.map((answer, index) => (
              <span key={index} className="animate-fade">
                {answer}
              </span>
            ))}
          </pre>
          <div className="px-4 mt-2 border-t border-neutral-100 border-dotted py-3">
            <h2 className="text-xs text-black">Based on:</h2>
            <div className="flex gap-2 flex-wrap mt-2">
              {metadata?.based_on?.map((item, index) => (
                <a
                  className="text-black text-xs rounded-md bg-orange-50 px-2 py-1"
                  href={item.source_id}
                  key={item.source_id + index}
                  target="_blank"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/*--------------------------------------------------------------------------*/

function SearchMenuGenerateAnswer({ query }: { query: string }) {
  const [state, setState] = React.useState<{
    isLoading: boolean;
    answer: string;
    basedOn?: AnswerResponse["based_on"];
    error: string | null;
  }>({
    isLoading: false,
    answer: "",
    error: null,
  });

  const { addMessageToChatHistory } = useChatHistory();

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const response = await getAnswer({
          question: query,
          signal: controller.signal,
        });
        if (response) {
          setState((prev) => ({
            ...prev,
            answer: response.answer,
            basedOn: response.based_on,
            isLoading: false,
          }));

          addMessageToChatHistory({
            question: query,
            answer: response.answer,
            basedOn: response.based_on,
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error?.message === "canceled") return;

          setState((prev) => ({
            ...prev,
            error: error.message,
            isLoading: false,
          }));
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [query]);

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-4">
        <SparklesThree />
        <div className="flex flex-col ">
          <h1 className="text-black text-base font-medium">
            How to install solar panels
          </h1>
          <p className="text-gray-800 text-xs">Powered by usefini.com</p>
        </div>
      </div>
      {state.isLoading ? (
        <div className="flex flex-col gap-3 py-3 px-4">
          <LoadingSkeleton
            className="w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
          <LoadingSkeleton
            className="w-3/4 ml-8 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <LoadingSkeleton
            className="w-1/2 ml-8 origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
          <LoadingSkeleton
            className="w-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1.4 }}
          />
        </div>
      ) : (
        <div>
          <pre
            className={cn(
              "whitespace-pre-wrap text-sm text-gray-800 m-0 leading-6 animate-fade py-3 px-4 border-t border-neutral-200 border-dotted",
              inter.className,
            )}
          >
            {state.answer}
          </pre>

          <div className="px-4 mt-2 border-t border-neutral-100 border-dotted py-3">
            <h2 className="text-xs text-black">Based on:</h2>
            <div className="flex gap-2 flex-wrap mt-2">
              {state.basedOn?.map((item, index) => (
                <a
                  className="text-black text-xs rounded-md bg-orange-50 px-2 py-1"
                  href={item.source_id}
                  key={item.source_id + index}
                  target="_blank"
                >
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchMenuItems({
  onItemSelect,
  query,
}: {
  onItemSelect: (nav: SEARCH_NAVIGATION_STATE) => void;
  query: string;
}) {
  const router = useRouter();

  const { chatHistory, searchChatHistory } = useChatHistory();

  const questions = React.useMemo(() => {
    return searchChatHistory(query)?.slice(0, 10) || [];
  }, [query, chatHistory.isLoading]);

  return (
    <>
      <SearchComboboxMenuItem
        isAiItem
        index={0}
        title={`Get AI assistance with "${query}"`}
        description="Powered by usefini.com"
        onClick={() =>
          onItemSelect({
            type: SEARCH_NAIGATION_TYPES.AI,
          })
        }
      />
      {questions.map((item, index) => (
        <SearchComboboxMenuItem
          index={index + 1}
          title={item.question}
          description={item.answer}
          onClick={() => {
            onItemSelect({ type: SEARCH_NAIGATION_TYPES.ANSWER });
            router.push(`/answers/${encodeURIComponent(item.question)}`);
          }}
        />
      ))}
    </>
  );
}
