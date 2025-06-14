"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { orders, orderItems } from "@/lib/db/schema"
import { takeFirstOrThrow } from "@/lib/db/utils"
import { getErrorMessage } from "@/lib/handle-error"
import { and, eq, inArray } from "drizzle-orm"
import { z } from "zod"

const updateOrdersSchema = z.object({
  ids: z.array(z.string()).min(1),
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
})

const deleteOrdersSchema = z.object({
  ids: z.array(z.string()).min(1),
})

const updateOrderSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  notes: z.string().optional(),
})

const createOrderSchema = z.object({
  userId: z.string(),
  orderNumber: z.string(),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().default("USD"),
  paymentMethod: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "cancelled", "refunded"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
    totalPrice: z.string().regex(/^\d+(\.\d{1,2})?$/),
  })),
})

export async function updateOrders(rawInput: z.infer<typeof updateOrdersSchema>) {
  try {
    const validatedInput = updateOrdersSchema.parse(rawInput)

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (validatedInput.status !== undefined) {
      updateData.status = validatedInput.status
    }

    if (validatedInput.paymentStatus !== undefined) {
      updateData.paymentStatus = validatedInput.paymentStatus
    }

    await db
      .update(orders)
      .set(updateData)
      .where(inArray(orders.id, validatedInput.ids))

    revalidatePath("/orders")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteOrders(rawInput: z.infer<typeof deleteOrdersSchema>) {
  try {
    const validatedInput = deleteOrdersSchema.parse(rawInput)

    // Delete order items first (foreign key constraint)
    await db.delete(orderItems).where(inArray(orderItems.orderId, validatedInput.ids))
    
    // Then delete orders
    await db.delete(orders).where(inArray(orders.id, validatedInput.ids))

    revalidatePath("/orders")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateOrder(rawInput: z.infer<typeof updateOrderSchema>) {
  try {
    const validatedInput = updateOrderSchema.parse(rawInput)

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (validatedInput.status !== undefined) {
      updateData.status = validatedInput.status
    }

    if (validatedInput.paymentStatus !== undefined) {
      updateData.paymentStatus = validatedInput.paymentStatus
    }

    if (validatedInput.paymentMethod !== undefined) {
      updateData.paymentMethod = validatedInput.paymentMethod
    }

    if (validatedInput.paymentId !== undefined) {
      updateData.paymentId = validatedInput.paymentId
    }

    if (validatedInput.notes !== undefined) {
      updateData.notes = validatedInput.notes
    }

    const order = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, validatedInput.id))
      .returning()
      .then(takeFirstOrThrow)

    revalidatePath("/orders")
    revalidatePath(`/orders/${validatedInput.id}`)

    return {
      data: order,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function createOrder(rawInput: z.infer<typeof createOrderSchema>) {
  try {
    const validatedInput = createOrderSchema.parse(rawInput)

    const result = await db.transaction(async (tx) => {
      // Create order
      const order = await tx
        .insert(orders)
        .values({
          userId: validatedInput.userId,
          orderNumber: validatedInput.orderNumber,
          totalAmount: validatedInput.totalAmount,
          currency: validatedInput.currency,
          paymentMethod: validatedInput.paymentMethod,
          status: validatedInput.status,
          paymentStatus: validatedInput.paymentStatus,
        })
        .returning()
        .then(takeFirstOrThrow)

      // Create order items
      if (validatedInput.items.length > 0) {
        await tx.insert(orderItems).values(
          validatedInput.items.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          }))
        )
      }

      return order
    })

    revalidatePath("/orders")

    return {
      data: result,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteOrder(id: string) {
  try {
    // Delete order items first
    await db.delete(orderItems).where(eq(orderItems.orderId, id))
    
    // Then delete order
    await db.delete(orders).where(eq(orders.id, id))

    revalidatePath("/orders")
    redirect("/orders")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}