import { NextResponse } from "next/server";
import prisma from "~/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { segementId } = body;

  if (!segementId) {
    return NextResponse.json(
      { status: "error", message: "Segment ID is required" },
      { status: 400 }
    );
  }

  const segment = await prisma.segment.findUnique({
    where: { id: segementId },
  });

  if (!segment) {
    return NextResponse.json(
      { status: "error", message: "Segment not found" },
      { status: 404 }
    );
  }

  const audience = segment?.audience as string[];

  if (!audience.length) {
    return NextResponse.json(
      { status: "error", message: "No audience found for this segment" },
      { status: 404 }
    );
  }

  for (const customerId of audience) {
    // Simulate a delay for each customer
    await delayMs(Math.random() * 100); // Random delay between 0 and 100 ms

    // with a success of 90% and failure of 10%
    const randomSuccess = Math.random() < 0.9;

    const logId = await prisma.communicationLog.findFirst({
      where: {
        customer: { id: customerId },
        segment: { id: segment.id },
      },
      select: { id: true },
    });

    if (logId) {
      await sendDeliveryStatus(logId.id, randomSuccess);
      continue;
    }
  }

  return NextResponse.json({ status: "success" }, { status: 200 });
}

const sendDeliveryStatus = async (logId: string, success: boolean) => {
  return fetch(
    process.env.NODE_ENV === "production"
      ? process.env.VERCEL_URL + "/api/delivery"
      : "http://localhost:3000/api/delivery",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logId,
        success,
      }),
    }
  );
};

const delayMs = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
