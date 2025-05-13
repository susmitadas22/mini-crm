import prisma from "~/lib/prisma";

export const campaign = {
  list: async () => {
    return await prisma.segment.findMany({ orderBy: { createdAt: "desc" } });
  },
};
