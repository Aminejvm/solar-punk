"use client";
import { Inter } from "next/font/google";
import localFonts from "next/font/local";
import { cn } from "~/common/tailwind";
import { LoadingSkeleton } from "~/components/primitives/loadingSkeleton";
import { useChatHistory } from "~/store/useChatHistory";

const inter = Inter({ subsets: ["latin"] });

const abcARizona = localFonts({
  weight: "700",
  src: "../../../../public/fonts/abc-arizona-flare.woff2",
});

export default function AnswerPage({ params }: { params: { pid: string } }) {
  const { chatHistory, getChatMessage } = useChatHistory();

  const question = decodeURIComponent(params.pid);

  if (chatHistory.isLoading) {
    return (
      <div className="w-[678px] mx-auto mt-36">
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-full" />
      </div>
    );
  }

  const selectedQuestion = getChatMessage(question);

  if (!selectedQuestion) {
    return (
      <div className="w-[678px] mx-auto mt-36 text-2xl text-black text-center">
        Question not found
      </div>
    );
  }

  return (
    <article className="w-[678px] mx-auto mt-36">
      <h1 className={cn("text-black text-2xl", abcARizona.className)}>
        {selectedQuestion.question}
      </h1>
      <pre
        className={cn(
          "whitespace-pre-wrap text-sm text-gray-800 m-0 leading-6 animate-fade py-3 border-t border-neutral-200 border-dotted mt-8",
          inter.className,
        )}
      >
        {selectedQuestion.answer}
      </pre>
      {selectedQuestion.basedOn && (
        <div className="mt-2 border-t border-neutral-100 border-dotted py-3">
          <h2 className="text-xs text-black">Based on:</h2>
          <div className="flex gap-2 flex-wrap mt-2">
            {selectedQuestion.basedOn?.map((item, index) => (
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
      )}{" "}
    </article>
  );
}
