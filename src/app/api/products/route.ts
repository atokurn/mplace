import { NextRequest, NextResponse } from 'next/server';

// Mock data - nanti bisa diganti dengan database query
const products = [
  {
    id: 1,
    title: 'Vibrant background',
    tags: ['Digital', 'Background', 'Colorful'],
    price: 12,
    image: '/placeholder.svg',
    description: 'A vibrant and colorful background perfect for digital designs',
    category: 'background',
    downloads: 1250,
    rating: 4.8,
    createdAt: '2024-01-15',
    featured: true
  },
  {
    id: 2,
    title: 'Man with leaves',
    tags: ['Portrait', 'Nature', 'Digital'],
    price: 38,
    image: '/placeholder.svg',
    description: 'Artistic portrait illustration with natural elements',
    category: 'illustration',
    downloads: 890,
    rating: 4.9,
    createdAt: '2024-01-10',
    featured: true
  },
  {
    id: 3,
    title: '3D spheres',
    tags: ['3D', 'Abstract', 'Modern'],
    price: 15,
    image: '/placeholder.svg',
    description: 'Modern 3D spheres with abstract design',
    category: '3d',
    downloads: 2100,
    rating: 4.7,
    createdAt: '2024-01-08',
    featured: false
  },
  {
    id: 4,
    title: 'Grunge texture',
    tags: ['Texture', 'Grunge', 'Vintage'],
    price: 55,
    image: '/placeholder.svg',
    description: 'Vintage grunge texture for retro designs',
    category: 'texture',
    downloads: 750,
    rating: 4.6,
    createdAt: '2024-01-05',
    featured: false
  },
  {
    id: 5,
    title: 'Geometric patterns',
    tags: ['Pattern', 'Geometric', 'Modern'],
    price: 25,
    image: '/placeholder.svg',
    description: 'Clean geometric patterns for modern designs',
    category: 'pattern',
    downloads: 1500,
    rating: 4.8,
    createdAt: '2024-01-03',
    featured: true
  },
  {
    id: 6,
    title: 'Watercolor splash',
    tags: ['Watercolor', 'Artistic', 'Creative'],
    price: 18,
    image: '/placeholder.svg',
    description: 'Beautiful watercolor splash effects',
    category: 'artistic',
    downloads: 980,
    rating: 4.9,
    createdAt: '2024-01-01',
    featured: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    let filteredProducts = [...products];

    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category === category
      );
    }

    // Filter by featured
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.title.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        category,
        featured,
        search,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi input
    const { title, price, tags, image, description, category } = body;
    
    if (!title || !price || !tags || !image || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulasi pembuatan produk baru
    const newProduct = {
      id: products.length + 1,
      title,
      price: parseFloat(price),
      tags: Array.isArray(tags) ? tags : [tags],
      image,
      description,
      category,
      downloads: 0,
      rating: 0,
      createdAt: new Date().toISOString().split('T')[0],
      featured: false
    };

    // Dalam implementasi nyata, simpan ke database
    products.push(newProduct);

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}