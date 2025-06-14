import { Shell } from '@/app/_components/shared/layouts/shell';
import { ProductForm } from '@/app/_components/features/admin/products/ProductForm';

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <ProductForm />
    </div>
  );
}