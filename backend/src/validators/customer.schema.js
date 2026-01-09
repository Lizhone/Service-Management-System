import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  notes: z.string().optional(),
}).strict();
