// app/api/ai/route.ts

import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge"; // optional, for performance

export async function POST(req: Request) {
  const { input } = await req.json();

  if (!input) {
    return NextResponse.json(
      { error: "Objective input is required" },
      { status: 400 }
    );
  }

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const prompt = `
    You are a marketing copywriter.
    Generate 3 short promotional messages (under 200 characters) for this campaign:

    "${input}"

    Make them human, punchy, and SMS/email-friendly.
    Use newline between each suggestion.
    `;

  const result = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
  });

  const suggestions = result.text
    ?.split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return NextResponse.json({ suggestions });
}
