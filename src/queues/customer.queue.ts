import { Queue } from "bullmq";
import { CONSTS } from "~/CONSTS";
import { redis } from "~/lib/redis";

export const customerQueue = new Queue(CONSTS.QUEUES.CUSTOMER_QUEUE, {
  connection: redis,
});
