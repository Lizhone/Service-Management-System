import { z } from 'zod';

export const createJobCardSchema = z.object({
  customer: z.object({
    name: z.string().min(1, 'Customer name is required'),
    mobileNumber: z
      .string()
      .regex(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
  }).strict(),

  vehicle: z.object({
    vinNumber: z.string().min(5, 'VIN must be at least 5 characters'),
    model: z.string().min(1, 'Vehicle model is required'),
  }).strict(),

  jobCard: z.object({
    serviceType: z.enum([
      'GENERAL',
      'PAID',
      'WARRANTY',
      'COMPLAINT',
      'BATTERY',
      'CHARGER',
    ]),
    serviceInDatetime: z
      .string()
      .datetime({ message: 'serviceInDatetime must be a valid ISO datetime' }),
  }).strict(),
}).strict();
