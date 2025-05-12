import prisma from "~/lib/prisma";

export const customer = {
  list: () => {
    return prisma.customer.findMany({});
  },
};
