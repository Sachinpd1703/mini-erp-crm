import { z } from 'zod';
import { ChallanStatus } from '@prisma/client';

export const createChallanSchema = z.object({
  body: z.object({
    customerId: z.string().uuid('Invalid customer ID format'),
    status: z.nativeEnum(ChallanStatus).optional(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid('Invalid product ID format'),
          quantity: z.number().int().positive('Item quantity must be at least 1'),
        })
      )
      .min(1, 'Sales Challan must contain at least one line item'),
  }),
});

export const updateChallanStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid sales challan ID format'),
  }),
  body: z.object({
    status: z.enum(['CONFIRMED', 'CANCELLED'], {
      errorMap: () => ({ message: 'Status can only be updated to CONFIRMED or CANCELLED' }),
    }),
  }),
});
