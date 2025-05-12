import { CONSTS } from "~/CONSTS";
import prisma from "~/lib/prisma";
import { redis } from "~/lib/redis";
import { Customer } from "~/schemas";
import { Worker } from "bullmq";

export const customerWorker = new Worker(
  CONSTS.QUEUES.CUSTOMER_QUEUE,
  async (job) => {
    const { data } = job.data as { data: Customer };
    await prisma.customer
      .create({
        data: { name: data.name, email: data.email, phone: data.phone },
      })
      .then((customer) =>
        console.log(
          `customerWorker: ${customer.id} created, with email ${customer.email}`
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

customerWorker.on("completed", async (job) => {
  console.log(`customerWorker: ${job?.id} completed`);
});

customerWorker.on("failed", async (job) => {
  console.error(`customerWorker: ${job?.id} failed, ${job?.failedReason}`);
});

customerWorker.on("ready", () => {
  console.log("customerWorker: ready");
});
