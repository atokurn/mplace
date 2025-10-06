import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import AboutClient from '@/app/_components/features/public/about/AboutClient';

export const metadata: Metadata = {
  title: 'About Us - PIXEL Digital Marketplace',
  description:
    'Learn about PIXEL, our mission to democratize digital creativity, and meet the team behind the premier digital asset marketplace.',
  keywords:
    'about pixel, digital marketplace, creative community, digital assets, mission, team',
  openGraph: {
    title: 'About Us - PIXEL Digital Marketplace',
    description: 'Learn about PIXEL and our mission to democratize digital creativity.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutClient />
    </div>
  );
}