import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Share2, 
  Star, 
  User, 
  Calendar, 
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ProductCard from '@/app/_components/shared/layouts/products/ProductCard';

interface Product {
  id: number;
  title: string;
  tags: string[];
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  createdAt: string;
  featured: boolean;
  author: string;
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Fetch product data on server
async function getProduct(id: string): Promise<{ product: Product; relatedProducts: Product[] } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
       next: { revalidate: 3600 } // Revalidate every hour
     });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getProduct(id);
  
  if (!data) {
    return {
      title: 'Product Not Found - DHXEL',
      description: 'The requested product could not be found.'
    };
  }

  const { product } = data;
  
  return {
    title: `${product.title} - DHXEL Marketplace`,
    description: product.description,
    keywords: product.tags.join(', '),
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image]
    }
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  // In a real app, fetch all product IDs from database
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const data = await getProduct(id);
  
  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/catalog" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Catalog
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-card-bg rounded-2xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User size={16} />
                <span>{product.author}</span>
                <span>•</span>
                <Calendar size={16} />
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {product.rating}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-3xl font-bold text-accent">
                ${product.price}
              </div>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                  Add to Cart
                </button>
                
                <button className="p-3 border border-border rounded-xl hover:bg-card-bg transition-colors">
                  <Heart size={20} />
                </button>
                
                <button className="p-3 border border-border rounded-xl hover:bg-card-bg transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <ProductCard
                    title={relatedProduct.title}
                    price={relatedProduct.price}
                    image={relatedProduct.image}
                    tags={relatedProduct.tags}
                    index={index}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}