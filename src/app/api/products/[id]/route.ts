import { NextRequest, NextResponse } from 'next/server';

// Mock data - sama seperti di route utama
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
    featured: true,
    author: 'DesignStudio',
    fileSize: '2.5 MB',
    dimensions: '1920x1080',
    format: 'PNG, JPG',
    license: 'Commercial Use'
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
    featured: true,
    author: 'ArtCreator',
    fileSize: '4.2 MB',
    dimensions: '2048x2048',
    format: 'AI, PNG',
    license: 'Commercial Use'
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
    featured: false,
    author: '3DDesigner',
    fileSize: '8.1 MB',
    dimensions: '3840x2160',
    format: 'OBJ, PNG',
    license: 'Commercial Use'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Simulasi related products
    const relatedProducts = products
      .filter(p => 
        p.id !== productId && 
        (p.category === product.category || 
         p.tags.some(tag => product.tags.includes(tag)))
      )
      .slice(0, 4);

    return NextResponse.json({
      product,
      relatedProducts
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id: productId // Ensure ID doesn't change
    };

    products[productIndex] = updatedProduct;

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Remove product
    const deletedProduct = products.splice(productIndex, 1)[0];

    return NextResponse.json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}