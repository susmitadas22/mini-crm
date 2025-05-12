import { NextResponse } from "next/server";
import { CONSTS } from "~/CONSTS";
import { orderQueue } from "~/queues";
import { orderSchema } from "~/schemas";

export async function POST(req: Request) {
  const body = await req.json();
  const { success, data, error } = await orderSchema.safeParseAsync(body);

  if (!success) {
    return NextResponse.json(
      { status: "error", message: error.errors[0].message },
      { status: 400 }
    );
  }

  await orderQueue.add(CONSTS.JOBS.INGEST_ORDER, { data });

  return NextResponse.json({ status: "queued" }, { status: 202 });
}
