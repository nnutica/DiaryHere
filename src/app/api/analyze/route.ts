import { NextRequest, NextResponse } from "next/server";

// Real API endpoint for diary analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid request: text is required" },
        { status: 400 }
      );
    }

    // Call the real AI endpoint
    const response = await fetch("https://nitinat-right-here.hf.space/getadvice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { error: "Failed to analyze diary entry" },
      { status: 500 }
    );
  }
}
