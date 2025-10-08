import { notFound } from 'next/navigation';
import { getProductById } from '@/app/_lib/queries/products';
import EditProductClient from './EditProductClient';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Fullscreen layout without admin header/sidebar
  return (
    <div className="min-h-screen">
      <EditProductClient product={product} />
    </div>
  );
}