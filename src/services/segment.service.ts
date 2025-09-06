import prisma from "~/lib/prisma";
import { CreateSegmentSchema } from "~/schemas";

export const segment = {
  create: async (data: CreateSegmentSchema) => {
    const segment = await prisma.segment.create({
      data: {
        name: data.segmentName,
        audience: {},
        ruleJson: {},
        message: data.message,
      },
    });
    return segment;
  },
};
