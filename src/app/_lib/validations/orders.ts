import { ordersSearchParamsCache } from "@/lib/search-params"
import { z } from "zod"

export const searchParamsSchemaOrders = ordersSearchParamsCache

export type GetOrdersSchema = z.infer<typeof searchParamsSchemaOrders>

export const createOrderSchema = z.object({
  userId: z.string(),
  orderNumber: z.string(),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  currency: z.string().default("USD"),
  paymentMethod: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
    totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  })).min(1, "At least one item is required"),
})

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
})

export const orderIdSchema = z.object({
  id: z.string(),
})

export const deleteOrdersSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one order must be selected"),
})

export const updateOrdersSchema = z.object({
  ids: z.array(z.string()).min(1, "At least one order must be selected"),
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
})

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
})

export type CreateOrderSchema = z.infer<typeof createOrderSchema>
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>
export type OrderIdSchema = z.infer<typeof orderIdSchema>
export type DeleteOrdersSchema = z.infer<typeof deleteOrdersSchema>
export type UpdateOrdersSchema = z.infer<typeof updateOrdersSchema>
export type OrderItemSchema = z.infer<typeof orderItemSchema>