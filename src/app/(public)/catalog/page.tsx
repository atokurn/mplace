import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import CatalogClient from '@/components/catalog/CatalogClient';

interface CatalogPageProps {
  searchParams: {
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
    limit?: string;
  };
}

export const metadata: Metadata = {
  title: 'Digital Asset Catalog - PIXEL',
  description: 'Browse our complete collection of premium digital assets including backgrounds, illustrations, 3D models, and more.',
  keywords: 'digital assets, backgrounds, illustrations, 3D models, textures, patterns',
};

// Fetch products from API with SSR
async function getProducts(searchParams: CatalogPageProps['searchParams']) {
  try {
    const params = new URLSearchParams();
    
    if (searchParams.search) params.append('search', searchParams.search);
    if (searchParams.category) params.append('category', searchParams.category);
    if (searchParams.sort) params.append('sort', searchParams.sort);
    if (searchParams.page) params.append('page', searchParams.page);
    if (searchParams.limit) params.append('limit', searchParams.limit);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products?${params.toString()}`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return {
      products: data.products || [],
      pagination: data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      },
      filters: data.filters || {
        categories: [],
        priceRange: { min: 0, max: 100 }
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      products: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      },
      filters: {
        categories: [],
        priceRange: { min: 0, max: 100 }
      }
    };
  }
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const data = await getProducts(searchParams);
  const { products, pagination, filters } = data;

  // Use API data or fallback to sample data
  const displayProducts = products.length > 0 ? products : [
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="w-full">
        <div className="w-full px-4 py-8 border-b border-border">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="orbitron-title text-4xl md:text-6xl font-bold text-foreground mb-6">Catalog</h1>
            <p className="text-muted-foreground text-lg">
              Discover high-quality digital assets for your creative projects
            </p>
          </div>
        </div>

        <CatalogClient 
          initialProducts={displayProducts}
          initialPagination={pagination}
          initialFilters={filters}
        />
      </main>
    </div>
  );
}