import { z } from 'zod';

export const registerBrokerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Invalid email address format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    brokerLicenseNo: z.string().optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['BROKER', 'ADMIN']).optional().default('BROKER'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const customerOnboardingSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Legal/Company name is required'),
    tradeName: z.string().optional(),
    email: z.string().email('Valid contact email is required'),
    phone: z.string().min(10, 'Valid phone number is required (min 10 digits)'),
    customerType: z.enum(['EXPORTER', 'IMPORTER', 'BOTH'], {
      errorMap: () => ({ message: 'Customer type must be EXPORTER, IMPORTER, or BOTH' }),
    }),
    gstin: z
      .string()
      .length(15, 'GSTIN must be exactly 15 characters long')
      .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, 'Invalid GSTIN format (e.g. 27AAAAA0000A1Z5)'),
    iec: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length === 10,
        { message: 'IEC (Import Export Code) must be 10 characters long if provided' }
      ),
    pan: z.string().optional(),
    address: z.string().min(5, 'Registered address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().length(6, 'Pincode must be 6 digits'),
  }),
});

export const verifyGstinSchema = z.object({
  body: z.object({
    gstin: z.string().length(15, 'GSTIN must be 15 characters long'),
  }),
});
