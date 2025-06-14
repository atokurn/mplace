import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import HomeClient from '@/app/_components/features/public/home/HomeClient';

export const metadata: Metadata = {
  title: 'PIXEL - Premium Digital Marketplace',
  description: 'Discover and purchase high-quality digital assets including backgrounds, illustrations, 3D models, textures, and more from talented creators worldwide.',
  keywords: 'digital marketplace, digital assets, backgrounds, illustrations, 3D models, textures, design resources',
  openGraph: {
    title: 'PIXEL - Premium Digital Marketplace',
    description: 'Discover and purchase high-quality digital assets from talented creators worldwide.',
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

const featuredProducts = [
  {
    title: 'Vibrant background',
    price: '$12',
    image: '/placeholder.svg',
    tags: ['Background', 'Abstract']
  },
  {
    title: 'Man with leaves',
    price: '$8',
    image: '/placeholder.svg',
    tags: ['Vector', 'Illustration']
  },
  {
    title: '3D spheres',
    price: '$15',
    image: '/placeholder.svg',
    tags: ['3D', 'Modern']
  },
  {
    title: 'Grunge texture',
    price: '$5',
    image: '/placeholder.svg',
    tags: ['Texture', 'Grunge']
  }
];

const products = [
  {
    title: 'Vibrant background',
    price: '$12',
    image: '/placeholder.svg',
    tags: ['Background', 'Abstract']
  },
  {
    title: 'Man with leaves',
    price: '$8',
    image: '/placeholder.svg',
    tags: ['Vector', 'Illustration']
  },
  {
    title: 'Plant icon',
    price: '$3',
    image: '/placeholder.svg',
    tags: ['Icon', 'Nature']
  },
  {
    title: 'Dark texture',
    price: '$7',
    image: '/placeholder.svg',
    tags: ['Texture', 'Dark']
  }
];

export default async function Home() {
  const { featuredProducts, products, stats } = await getHomePageData();
  
  // Fallback data if API fails
  const fallbackFeatured = [
    {
      id: 1,
      title: 'Vibrant background',
      tags: ['Digital', 'Background', 'Colorful'],
      price: 12,
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'Man with leaves',
      tags: ['Portrait', 'Nature', 'Digital'],
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
      title: 'Digital landscape',
      tags: ['Landscape', 'Digital', 'Nature'],
      price: 65,
      image: '/placeholder.svg'
    }
  ];

  const fallbackStats = {
    totalDownloads: 8945,
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
