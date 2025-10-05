import { z } from "zod";

// Company Profile Schema
export const companyProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  logo: z.string().optional(), // Base64 encoded image or URL
});

export type CompanyProfile = z.infer<typeof companyProfileSchema>;
export type InsertCompanyProfile = z.infer<typeof companyProfileSchema>;

// Invoice Item Schema
export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be positive"),
  amount: z.number().min(0, "Amount must be positive"),
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;

// Invoice Schema
export const invoiceSchema = z.object({
  id: z.string().optional(),
  number: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Invoice date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid client email is required").optional(),
  clientAddress: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  discount: z.number().min(0).max(100).default(0),
  discountAmount: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100).default(0),
  taxAmount: z.number().min(0).default(0),
  total: z.number().min(0),
  notes: z.string().optional(),
  companyProfile: companyProfileSchema,
});

export type Invoice = z.infer<typeof invoiceSchema>;
export type InsertInvoice = z.infer<typeof invoiceSchema>;

// Invoice Template Schema (for saved templates)
export const invoiceTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Template name is required"),
  companyProfile: companyProfileSchema,
  defaultItems: z.array(invoiceItemSchema).optional(),
  defaultTaxRate: z.number().min(0).max(100).default(0),
  defaultDiscount: z.number().min(0).max(100).default(0),
  defaultNotes: z.string().optional(),
  createdAt: z.string(),
});

export type InvoiceTemplate = z.infer<typeof invoiceTemplateSchema>;
export type InsertInvoiceTemplate = z.infer<typeof invoiceTemplateSchema>;
