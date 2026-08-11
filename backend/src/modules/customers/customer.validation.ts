import { z } from 'zod';
import { CustomerType, CustomerStatus } from '@prisma/client';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Customer name must be at least 2 characters'),
    mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
    email: z.string().email('Invalid email address format'),
    businessName: z.string().min(1, 'Business name is required'),
    gstNumber: z.string().optional().nullable(),
    customerType: z.nativeEnum(CustomerType).optional(),
    address: z.string().min(3, 'Address is required'),
    status: z.nativeEnum(CustomerStatus).optional(),
    followUpDate: z.string().optional().nullable(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid customer ID format'),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    mobile: z.string().min(10).optional(),
    email: z.string().email().optional(),
    businessName: z.string().min(1).optional(),
    gstNumber: z.string().optional().nullable(),
    customerType: z.nativeEnum(CustomerType).optional(),
    address: z.string().min(3).optional(),
    status: z.nativeEnum(CustomerStatus).optional(),
    followUpDate: z.string().optional().nullable(),
  }),
});

export const addCustomerNoteSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid customer ID format'),
  }),
  body: z.object({
    note: z.string().min(1, 'Note content cannot be empty'),
  }),
});
