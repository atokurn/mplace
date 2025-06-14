import { notFound } from 'next/navigation';
import { Shell } from '@/app/_components/shared/layouts/shell';
import { ProductForm } from '@/app/_components/features/admin/products/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getProductById } from '@/app/_lib/queries/products';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <Shell variant="sidebar">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">
            Update product information and settings
          </p>
        </div>
      </div>
      
      <ProductForm product={product} />
    </Shell>
  );
}