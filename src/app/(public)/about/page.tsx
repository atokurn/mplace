import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import AboutClient from '@/app/_components/features/public/about/AboutClient';

export const metadata: Metadata = {
  title: 'About Us - FlatMarket Physical Products',
  description: 'Pelajari tentang FlatMarket, misi kami untuk memajukan penjualan produk fisik berkualitas, dan tim di balik marketplace ini.',
  keywords: 'tentang flatmarket, marketplace produk fisik, komunitas kreator, produk fisik, misi, tim',
  openGraph: {
    title: 'About Us - FlatMarket Physical Products',
    description: 'Pelajari tentang FlatMarket dan misi kami meningkatkan akses ke produk fisik berkualitas.',
    type: 'website'
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutClient />
    </div>
  );
}