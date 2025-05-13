"use server";

import prisma from "~/lib/prisma";
import { CreateSegmentSchema, Rules } from "~/schemas";
import { api } from "~/services";

export const getAudiencePreview = async (rules: Rules[]) => {
  // Fetch customers with calculated orderCount and totalSpend
  const customers = await api.customer.list();
  // Filter customers based on rules (e.g., totalSpend > 1000)
  const filteredCustomers = customers.filter((customer) => {
    return rules.every((rule) => {
      switch (rule.field) {
        case "total_spend":
          if (rule.operator === "greater_than") {
            return customer.totalSpend > parseFloat(rule.value);
          }
          if (rule.operator === "less_than") {
            return customer.totalSpend < parseFloat(rule.value);
          }
          if (rule.operator === "equal_to") {
            return customer.totalSpend === parseFloat(rule.value);
          }
          break;
        case "order_count":
          if (rule.operator === "greater_than") {
            return customer.orderCount > parseInt(rule.value);
          }
          if (rule.operator === "less_than") {
            return customer.orderCount < parseInt(rule.value);
          }
          if (rule.operator === "equal_to") {
            return customer.orderCount === parseInt(rule.value);
          }
          break;
        case "last_order_date":
          if (rule.operator === "greater_than") {
            return customer.orders[0].createdAt > new Date(rule.value);
          }
          if (rule.operator === "less_than") {
            return customer.orders[0].createdAt < new Date(rule.value);
          }
          if (rule.operator === "equal_to") {
            return customer.orders[0].createdAt === new Date(rule.value);
          }
          break;
      }
      return false;
    });
  });
  return filteredCustomers;
};

export const createSegment = async (createSegmentData: CreateSegmentSchema) => {
  const audience = await getAudiencePreview(createSegmentData.rules);
  const segment = await prisma.segment.create({
    data: {
      name: createSegmentData.segmentName,
      ruleJson: createSegmentData.rules,
      audience: audience.map((customer) => customer.id),
      message: createSegmentData.message,
    },
  });
  Promise.all(
    audience.map(async (customer) => {
      await prisma.communicationLog.create({
        data: {
          status: "PENDING",
          customer: { connect: { id: customer.id } },
          segment: { connect: { id: segment.id } },
        },
      });
      return console.log(
        "Communication log created for customer:",
        customer.id
      );
    })
  );

  // Send notification to vendor
  await fetch(
    process.env.NODE_ENV === "production"
      ? process.env.VERCEL_URL + "/api/vendor"
      : "http://localhost:3000/api/vendor",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        segementId: segment.id,
      }),
    }
  );

  return segment;
};
