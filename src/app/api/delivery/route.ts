import { NextResponse } from "next/server";
import { CONSTS } from "~/CONSTS";
import { deliveryQueue } from "~/queues";

export async function POST(req: Request) {
  const { logId, success } = await req.json();

  if (!logId || typeof success !== "boolean") {
    return NextResponse.json(
      { status: "error", message: "Invalid payload" },
      { status: 400 }
    );
  }

  await deliveryQueue.add(CONSTS.JOBS.LOG_STATUS, { data: { logId, success } });

  return NextResponse.json({ status: "success" }, { status: 200 });
}
