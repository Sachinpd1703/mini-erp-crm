import { z } from 'zod';
import { MovementType } from '@prisma/client';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    sku: z.string().min(2, 'SKU code is required'),
    category: z.string().min(1, 'Category is required'),
    unitPrice: z.number().positive('Unit price must be greater than 0'),
    currentStock: z.number().int().nonnegative('Stock cannot be negative').optional(),
    minStockAlert: z.number().int().nonnegative().optional(),
    location: z.string().optional().nullable(),
    imageUrl: z.string().url('Invalid image URL format').optional().nullable(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID format'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    sku: z.string().min(2).optional(),
    category: z.string().min(1).optional(),
    unitPrice: z.number().positive().optional(),
    minStockAlert: z.number().int().nonnegative().optional(),
    location: z.string().optional().nullable(),
    imageUrl: z.string().url().optional().nullable(),
  }),
});

export const adjustStockSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID format'),
  }),
  body: z.object({
    quantity: z.number().int().positive('Quantity must be greater than 0'),
    movementType: z.nativeEnum(MovementType),
    reason: z.string().min(3, 'Reason for stock adjustment is required'),
  }),
});
