import { CONSTS } from "~/CONSTS";
import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import { Worker } from "bullmq";
import { DeliveryStatus } from "~/generated/prisma";

export const deliveryWorker = new Worker(
  CONSTS.QUEUES.DELIVERY_QUEUE,
  async (job) => {
    const { data } = job.data as { data: { logId: string; success: boolean } };
    const { logId, success } = data;

    const status: DeliveryStatus = success ? "SENT" : "FAILED";

    await prisma.communicationLog.update({
      where: { id: logId },
      data: { status },
    });

    return { status: "success" };
  },
  {
    connection: redis,
    concurrency: 10,
    removeOnFail: { age: 60 * 60 * 24 }, // 1 day
  }
);

deliveryWorker.on("completed", async (job) => {
  console.log(`deliveryWorker: ${job?.id} completed`);
});

deliveryWorker.on("failed", async (job) => {
  console.error(`deliveryWorker: ${job?.id} failed, ${job?.failedReason}`);
});

deliveryWorker.on("ready", () => {
  console.log("deliveryWorker: ready");
});
