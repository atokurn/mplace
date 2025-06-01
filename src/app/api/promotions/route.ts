import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { promotions, insertPromotionSchema } from '@/lib/db/schema';
import { eq, desc, ilike, and, count, gte, lte } from 'drizzle-orm';

// GET /api/promotions - Get all promotions with optional filtering
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [];
    
    if (type && type !== 'all') {
      conditions.push(eq(promotions.type, type));
    }
    
    if (status) {
      const now = new Date();
      switch (status) {
        case 'active':
          conditions.push(
            and(
              eq(promotions.isActive, true),
              lte(promotions.startsAt, now),
              gte(promotions.expiresAt, now)
            )
          );
          break;
        case 'expired':
          conditions.push(lte(promotions.expiresAt, now));
          break;
        case 'scheduled':
          conditions.push(gte(promotions.startsAt, now));
          break;
        case 'inactive':
          conditions.push(eq(promotions.isActive, false));
          break;
      }
    }
    
    if (search) {
      conditions.push(
        and(
          ilike(promotions.title, `%${search}%`),
          ilike(promotions.code, `%${search}%`)
        )
      );
    }

    // Get promotions with pagination
    const allPromotions = await db
      .select()
      .from(promotions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sortOrder === 'desc' ? desc(promotions[sortBy as keyof typeof promotions]) : promotions[sortBy as keyof typeof promotions])
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [totalResult] = await db
      .select({ count: count() })
      .from(promotions)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      promotions: allPromotions,
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
    console.error('Get promotions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch promotions' },
      { status: 500 }
    );
  }
}

// POST /api/promotions - Create new promotion (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = insertPromotionSchema.parse({
      ...body,
      createdBy: session.user.id,
    });
    
    // Create promotion
    const newPromotion = await db
      .insert(promotions)
      .values(validatedData)
      .returning();
    
    return NextResponse.json(
      { 
        message: 'Promotion created successfully',
        promotion: newPromotion[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create promotion error:', error);
    return NextResponse.json(
      { error: 'Failed to create promotion' },
      { status: 500 }
    );
  }
}