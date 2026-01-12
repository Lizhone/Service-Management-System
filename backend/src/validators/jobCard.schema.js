import { z } from "zod";

export const createJobCardSchema = z.object({
  jobCardNumber: z.string(),

  serviceType: z.enum(["GENERAL", "COMPLAINT", "BATTERY", "CHARGER"]),

  serviceAdvisorId: z.number(),

  status: z.literal("OPEN"),

  serviceInDatetime: z.string().datetime(),

  customerData: z.object({
    name: z.string(),
    mobileNumber: z.string(),
  }),

  vehicleData: z.object({
    vinNumber: z.string(),
    model: z.string(),
  }),
});
