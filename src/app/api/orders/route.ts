import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { orders, orderItems, products, users, insertOrderSchema } from '@/lib/db/schema';
import { eq, desc, ilike, and, count, sql } from 'drizzle-orm';

// GET /api/orders - Get all orders with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [];
    
    if (status && status !== 'all') {
      conditions.push(eq(orders.status, status));
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      conditions.push(eq(orders.paymentStatus, paymentStatus));
    }
    
    if (search) {
      conditions.push(ilike(users.name, `%${search}%`));
    }

    // Get orders with user info and item count
    const ordersWithDetails = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        customerName: users.name,
        customerEmail: users.email,
        customerAvatar: users.avatar,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        totalAmount: orders.totalAmount,
        currency: orders.currency,
        paymentMethod: orders.paymentMethod,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        itemCount: sql<number>`COUNT(${orderItems.id})`
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(orders.id, users.id)
      .orderBy(sortOrder === 'desc' ? desc(orders[sortBy as keyof typeof orders]) : orders[sortBy as keyof typeof orders])
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders: ordersWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = insertOrderSchema.parse({
      ...body,
      userId: session.user.id,
    });
    
    // Create order
    const newOrder = await db
      .insert(orders)
      .values(validatedData)
      .returning();
    
    return NextResponse.json(
      { 
        message: 'Order created successfully',
        order: newOrder[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}