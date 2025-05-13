import prisma from "~/lib/prisma";

export const customer = {
  getAll: () => {
    return prisma.customer.findMany({});
  },

  list: async () => {
    const customers = await prisma.customer.findMany({
      include: {
        orders: true, // Include the orders for each customer
      },
    });

    // Calculate order count and total spend for each customer
    const customersWithStats = customers.map((customer) => {
      const orderCount = customer.orders.length;
      const totalSpend = customer.orders.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      return {
        ...customer,
        orderCount,
        totalSpend,
      };
    });

    return customersWithStats;
  },
};
