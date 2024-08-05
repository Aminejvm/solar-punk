import { NextRequest, NextResponse } from "next/server";
import { AnswerResponse, getAnswer } from "~/queries/fini/getAnswer";

function isResponse(obj: any): obj is Response {
  return obj instanceof Response;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stream } = body;

    const answer = await getAnswer(body);

    if (!stream) {
      return NextResponse.json(answer as AnswerResponse);
    } else {
      // Handle streaming response
      if (!isResponse(answer)) {
        throw new Error("Expected streaming response but got AnswerResponse");
      }

      // Create a TransformStream to pass through chunks
      const transformStream = new TransformStream();
      const writer = transformStream.writable.getWriter();

      // Start reading the response and writing to the stream
      (async () => {
        // Use a type assertion here to tell TypeScript that body is not null
        const reader = (answer.body as ReadableStream).getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
          }
        } finally {
          writer.close();
        }
      })();

      // Return a streaming response
      return new NextResponse(transformStream.readable, {
        headers: {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked",
        },
      });
    }
  } catch (error) {
    console.error("Error getting answer:", error);
    return NextResponse.json(
      { error: "Failed to get answer" },
      { status: 500 },
    );
  }
}
