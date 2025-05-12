import { CONSTS } from "~/CONSTS";
import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import { Order } from "~/schemas";
import { Worker } from "bullmq";

export const orderWorker = new Worker(
  CONSTS.QUEUES.ORDER_QUEUE,
  async (job) => {
    const { data } = job.data as { data: Order };
    const customer = await prisma.customer.findUnique({
      where: { email: data.customerEmail },
    });

    if (!customer) {
      throw new Error(`Customer with email ${data.customerEmail} not found`);
    }

    await prisma.order
      .create({
        data: {
          customer: { connect: { id: customer.id } },
          amount: data.amount,
        },
      })
      .then((order) =>
        console.log(
          `orderWorker: order ${order.id} created for ${data.customerEmail}`
        )
      );

    return { status: "success" };
  },
  {
    connection: redis,
    concurrency: 10,
    removeOnFail: { age: 60 * 60 * 24 }, // 1 day
  }
);

orderWorker.on("completed", async (job) => {
  console.log(`orderWorker: ${job?.id} completed`);
});

orderWorker.on("failed", async (job) => {
  console.error(`orderWorker: ${job?.id} failed, ${job?.failedReason}`);
});

orderWorker.on("ready", () => {
  console.log("orderWorker: ready");
});
