import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import ContactClient from '@/app/_components/features/public/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us - PIXEL Digital Marketplace',
  description: 'Get in touch with PIXEL team. Send us a message, call us, or visit our office. We are here to help with all your digital asset needs.',
  keywords: 'contact pixel, customer support, help, digital marketplace support, get in touch',
  openGraph: {
    title: 'Contact Us - PIXEL Digital Marketplace',
    description: 'Get in touch with PIXEL team for support and inquiries.',
    type: 'website'
  }
};

// Fetch contact information with SSR
async function getContactData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/contact?type=info`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch contact data');
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching contact data:', error);
    // Fallback data
    return {
      email: 'hello@pixel.com',
      phone: '+1 (555) 123-4567',
      address: '123 Digital Street, Tech City, TC 12345',
      socialMedia: {
        twitter: 'https://twitter.com/pixel',
        instagram: 'https://instagram.com/pixel',
        linkedin: 'https://linkedin.com/company/pixel',
        facebook: 'https://facebook.com/pixel'
      },
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      }
    };
  }
}



export default async function ContactPage() {
  const contactData = await getContactData();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <ContactClient contactInfo={contactData} />
    </div>
  );
}