import { NextResponse } from "next/server";
import { CONSTS } from "~/CONSTS";
import { customerQueue } from "~/queues";
import { customerSchema } from "~/schemas";

export async function POST(req: Request) {
  const body = await req.json();
  const { success, data, error } = await customerSchema.safeParseAsync(body);

  if (!success) {
    return NextResponse.json(
      { status: "error", message: error.errors[0].message },
      { status: 400 }
    );
  }

  await customerQueue.add(CONSTS.JOBS.INGEST_CUSTOMER, { data });

  return NextResponse.json({ status: "queued" }, { status: 202 });
}
