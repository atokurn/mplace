import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { products, insertProductSchema } from '@/lib/db/schema';
import { eq, desc, ilike, and, count } from 'drizzle-orm';

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Build conditions
    const conditions = [eq(products.isActive, true)];
    
    if (category && category !== 'all') {
      conditions.push(eq(products.category, category));
    }
    
    if (search) {
      conditions.push(ilike(products.title, `%${search}%`));
    }

    // Get products with pagination
    const allProducts = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(sortOrder === 'desc' ? desc(products[sortBy as keyof typeof products]) : products[sortBy as keyof typeof products])
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [totalCount] = await db
      .select({ count: count() })
      .from(products)
      .where(and(...conditions));

    return NextResponse.json({
      products: allProducts,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        totalPages: Math.ceil(totalCount.count / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product (admin only)
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
    const validatedData = insertProductSchema.parse({
      ...body,
      createdBy: session.user.id,
    });
    
    // Create product
    const newProduct = await db
      .insert(products)
      .values(validatedData)
      .returning();
    
    return NextResponse.json(
      { 
        message: 'Product created successfully',
        product: newProduct[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}