import { NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import prisma from "~/lib/prisma";

export async function POST(req: Request) {
  const { campaignId: segmentId } = await req.json();

  const segment = await prisma.segment.findUnique({
    where: { id: segmentId },
  });

  if (!segment || !segment.audience) {
    return NextResponse.json({ error: "Segment not found" }, { status: 404 });
  }

  const audience = (segment.audience as string[]) || [];

  const logs = await prisma.communicationLog.findMany({
    where: { segmentId: segment.id },
    orderBy: { createdAt: "desc" },
  });

  const delivered = logs.filter((log) => log.status === "SENT").length;
  const failed = logs.filter((log) => log.status === "FAILED").length;

  const prompt = `
Generate a human-readable performance summary for this campaign:

- Reached: ${audience.length}
- Delivered: ${delivered}
- Failed: ${failed}
- Campaign Message: "${segment.message}"

Keep it under 2-3 sentences, sound professional but friendly.
  `;

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const result = await generateText({
    model: google("gemini-2.0-flash"),
    prompt,
  });

  return NextResponse.json({ insight: result.text });
}
