'use client';

import { motion } from 'framer-motion';
import { Target, Users, Award, Zap, Heart, Globe, Lightbulb, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Image from 'next/image';

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
    description: 'Visionary leader with 10+ years in product design and marketplace development.'
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

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="orbitron-title text-4xl md:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('about').toUpperCase()}
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Kami adalah marketplace modern untuk produk fisik yang memberdayakan kreator dan desainer di seluruh dunia.
            Platform kami menghubungkan para pembuat (makers) dengan bisnis dan individu yang mencari produk fisik premium.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Target size={24} className="text-accent" />
                </div>
                <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground">
                  OUR MISSION
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Mendemokratisasi akses ke produk fisik berkualitas tinggi dan membangun ekosistem yang berkembang
                di mana kreativitas bertemu dengan perdagangan. Kami percaya setiap desainer layak mendapat
                pengakuan dan setiap proyek layak mendapat pengerjaan (craftsmanship) yang luar biasa.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Melalui platform kami, kami membangun jembatan antara para pemikir kreatif dan mereka yang
                membutuhkan keahlian mereka, mendorong inovasi dan mendorong batas-batas desain produk.
              </p>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <motion.div
                  className="w-64 h-64 bg-accent/10 rounded-full flex items-center justify-center"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center">
                    <Zap size={48} className="text-accent" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-4">
              BY THE NUMBERS
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform&apos;s growth reflects the trust and satisfaction of our global community
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              const label = stat.label === 'Digital Assets' ? 'Physical Products' : stat.label;
              const description = stat.description === 'High-quality designs and resources' ? 'High-quality physical goods from talented makers' : stat.description;
              return (
                <motion.div
                  key={label}
                  className="bg-secondary/50 border border-border rounded-2xl p-6 text-center hover:bg-secondary/70 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={24} className="text-accent" />
                  </div>
                  <h3 className="orbitron-title text-2xl font-bold text-foreground mb-2">{stat.number}</h3>
                  <p className="orbitron-font text-foreground font-semibold mb-1">{label}</p>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-4">
              OUR VALUES
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and shape our platform&apos;s future
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="bg-background border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent size={24} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="orbitron-font text-foreground font-semibold text-lg mb-3">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-4">
              MEET THE TEAM
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind DAMA who make our vision a reality
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-secondary/50 border border-border rounded-2xl p-6 text-center hover:bg-secondary/70 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover border-2 border-accent/20"
                  />
                </div>
                <h3 className="orbitron-font text-foreground font-semibold mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <h2 className="orbitron-title text-3xl md:text-4xl font-bold text-foreground mb-6">
-              JOIN OUR COMMUNITY
+              JOIN OUR COMMUNITY
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
-              Whether you&apos;re a creator looking to showcase your work or someone seeking premium physical products,
-              DAMA is the perfect place to connect, create, and grow.
+              Whether you&apos;re a creator looking to showcase your work or someone seeking premium physical products,
+              FlatMarket is the perfect place to connect, create, and grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-accent text-black font-semibold py-3 px-8 rounded-lg hover:bg-accent/90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                EXPLORE CATALOG
              </motion.button>
              <motion.button
                className="bg-transparent border border-border text-foreground font-semibold py-3 px-8 rounded-lg hover:bg-secondary/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                BECOME A SELLER
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}