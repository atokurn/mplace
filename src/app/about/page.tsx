import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import AboutClient from '@/components/about/AboutClient';
import { Users, Award, Globe, Zap, Heart, Target, Lightbulb, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - PIXEL Digital Marketplace',
  description: 'Learn about PIXEL, our mission to democratize digital creativity, and meet the team behind the premier digital asset marketplace.',
  keywords: 'about pixel, digital marketplace, creative community, digital assets, mission, team',
  openGraph: {
    title: 'About Us - PIXEL Digital Marketplace',
    description: 'Learn about PIXEL and our mission to democratize digital creativity.',
    type: 'website'
  }
};

// Fetch team and company data with SSR
async function getAboutData() {
  try {
    // In a real app, this would fetch from an API or CMS
    const aboutData = {
      company: {
        founded: '2024',
        employees: '50+',
        countries: '25+',
        assets: '10,000+'
      },
      team: [
        {
          id: 1,
          name: 'Sarah Johnson',
          role: 'CEO & Founder',
          image: '/placeholder.svg',
          bio: 'Passionate about democratizing digital creativity and empowering artists worldwide.'
        },
        {
          id: 2,
          name: 'Michael Chen',
          role: 'CTO',
          image: '/placeholder.svg',
          bio: 'Leading our technical vision to build the most innovative digital marketplace.'
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          role: 'Head of Design',
          image: '/placeholder.svg',
          bio: 'Ensuring every pixel of our platform delivers an exceptional user experience.'
        },
        {
          id: 4,
          name: 'David Kim',
          role: 'Head of Community',
          image: '/placeholder.svg',
          bio: 'Building bridges between creators and fostering our vibrant creative community.'
        }
      ],
      values: [
        {
          icon: 'Users',
          title: 'Community First',
          description: 'We believe in the power of creative communities and put our users at the center of everything we do.'
        },
        {
          icon: 'Target',
          title: 'Quality Focus',
          description: 'Every asset on our platform meets the highest standards of quality and creativity.'
        },
        {
          icon: 'Award',
          title: 'Excellence',
          description: 'We strive for excellence in every aspect of our platform and service.'
        },
        {
          icon: 'Zap',
          title: 'Innovation',
          description: 'We continuously innovate to provide the best tools and experience for creators.'
        },
        {
          icon: 'Heart',
          title: 'Passion',
          description: 'Our passion for digital art and creativity drives everything we do.'
        },
        {
          icon: 'Globe',
          title: 'Global Reach',
          description: 'We connect creators and buyers from around the world in one unified marketplace.'
        }
      ]
    };

    return aboutData;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return {
      company: {
        founded: '2024',
        employees: '50+',
        countries: '25+',
        assets: '10,000+'
      },
      team: [],
      values: []
    };
  }
}

const stats = [
  {
    icon: Users,
    number: '10K+',
    label: 'Happy Customers',
    description: 'Creators worldwide trust our platform'
  },
  {
    icon: Award,
    number: '50K+',
    label: 'Digital Assets',
    description: 'High-quality designs and resources'
  },
  {
    icon: Globe,
    number: '100+',
    label: 'Countries',
    description: 'Global reach and accessibility'
  },
  {
    icon: Zap,
    number: '99.9%',
    label: 'Uptime',
    description: 'Reliable and fast platform'
  }
];

const values = [
  {
    icon: Heart,
    title: 'Quality First',
    description: 'Every asset on our platform is carefully curated and meets the highest quality standards for professional use.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly evolve our platform with cutting-edge technology to provide the best user experience.'
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Your data and transactions are protected with enterprise-grade security measures and encryption.'
  },
  {
    icon: Globe,
    title: 'Global Community',
    description: 'We connect creators and designers from around the world, fostering a vibrant creative ecosystem.'
  }
];

const team = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    image: '/placeholder.svg',
    description: 'Visionary leader with 10+ years in digital design and marketplace development.'
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Design',
    image: '/placeholder.svg',
    description: 'Creative director ensuring every pixel meets our quality standards.'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    image: '/placeholder.svg',
    description: 'Technology expert building scalable and secure platform infrastructure.'
  },
  {
    name: 'Emily Zhang',
    role: 'Community Manager',
    image: '/placeholder.svg',
    description: 'Connecting creators and fostering our global design community.'
  }
];

export default async function AboutPage() {
  const aboutData = await getAboutData();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <AboutClient 
        company={aboutData.company}
        team={aboutData.team}
        values={aboutData.values}
      />
    </div>
  );
}