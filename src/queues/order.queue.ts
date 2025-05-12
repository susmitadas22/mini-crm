import { Queue } from "bullmq";
import { CONSTS } from "~/CONSTS";
import { redis } from "~/lib/redis";

export const orderQueue = new Queue(CONSTS.QUEUES.ORDER_QUEUE, {
  connection: redis,
});
