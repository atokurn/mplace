import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import HomeClient from '@/app/_components/features/public/home/HomeClient';

export const metadata: Metadata = {
  title: 'PIXEL - Premium Marketplace',
  description: 'Discover and purchase high-quality products from talented creators worldwide.',
  keywords: 'marketplace, products, design resources',
  openGraph: {
    title: 'PIXEL - Premium Marketplace',
    description: 'Discover and purchase high-quality products from talented creators worldwide.',
    type: 'website'
  }
};

// Fetch homepage data with SSR
async function getHomePageData() {
  try {
    // Use direct database queries instead of API routes
    // For now, return fallback data until API routes are implemented
    return {
      featuredProducts: [],
      products: [],
      stats: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
      }
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      featuredProducts: [],
      products: [],
      stats: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
      }
    };
  }
}

export default async function Home() {
  const { featuredProducts, products, stats } = await getHomePageData();
  
  // Fallback data if API fails
  const fallbackFeatured = [
    {
      id: 1,
      title: 'Vibrant background',
      tags: ['Background', 'Colorful', 'Physical'],
      price: 12,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Man with leaves',
      tags: ['Portrait', 'Nature', 'Physical'],
      price: 38,
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: '3D spheres',
      tags: ['3D', 'Abstract', 'Modern'],
      price: 15,
      image: '/placeholder.svg'
    },
    {
      id: 4,
      title: 'Grunge texture',
      tags: ['Texture', 'Grunge', 'Vintage'],
      price: 55,
      image: '/placeholder.svg'
    }
  ];

  const fallbackProducts = [
    {
      id: 5,
      title: 'Abstract patterns',
      tags: ['Abstract', 'Pattern', 'Geometric'],
      price: 25,
      image: '/placeholder.svg'
    },
    {
      id: 6,
      title: 'Neon lights',
      tags: ['Neon', 'Futuristic', 'Glow'],
      price: 42,
      image: '/placeholder.svg'
    },
    {
      id: 7,
      title: 'Geometric shapes',
      tags: ['Geometric', 'Minimal', 'Clean'],
      price: 18,
      image: '/placeholder.svg'
    },
    {
      id: 8,
      title: 'Landscape poster',
      tags: ['Landscape', 'Physical', 'Nature'],
      price: 65,
      image: '/placeholder.svg'
    }
  ];

  const fallbackStats = {
    totalUsers: 2847,
    totalSales: 1523,
    totalRevenue: 125430
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <HomeClient 
        featuredProducts={featuredProducts.length > 0 ? featuredProducts : fallbackFeatured}
        products={products.length > 0 ? products : fallbackProducts}
        stats={stats || fallbackStats}
      />
    </div>
  );
}
