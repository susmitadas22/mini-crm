import prisma from "~/lib/prisma";

export const order = {
  list: () => {
    return prisma.order.findMany({ include: { customer: true } });
  },
};
