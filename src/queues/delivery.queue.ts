import { Queue } from "bullmq";
import { CONSTS } from "~/CONSTS";
import { redis } from "~/lib/redis";

export const deliveryQueue = new Queue(CONSTS.QUEUES.DELIVERY_QUEUE, {
  connection: redis,
});
