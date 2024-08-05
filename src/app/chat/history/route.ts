import { NextRequest, NextResponse } from "next/server";
import { getChatHistory } from "~/queries/fini/getChatHistory";

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching chat history");
    const history = await getChatHistory();
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 },
    );
  }
}
