import { db } from './index';
import { users, categories, products, settings } from './schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin!123', 10);
    
    const [adminUser] = await db.insert(users).values({
      email: process.env.ADMIN_USERNAME || 'admin@dama.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    }).returning();

    console.log('✅ Admin user created:', adminUser.email);

    // Create default categories
    const categoryData = [
      {
        name: 'Digital Art',
        description: 'Digital artwork, illustrations, and graphics',
        slug: 'digital-art',
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Templates',
        description: 'Website templates, design templates, and layouts',
        slug: 'templates',
        isActive: true,
        sortOrder: 2,
      },
      {
        name: 'Fonts',
        description: 'Typography and font collections',
        slug: 'fonts',
        isActive: true,
        sortOrder: 3,
      },
      {
        name: 'Icons',
        description: 'Icon sets and symbol collections',
        slug: 'icons',
        isActive: true,
        sortOrder: 4,
      },
      {
        name: 'Photos',
        description: 'Stock photos and photography',
        slug: 'photos',
        isActive: true,
        sortOrder: 5,
      },
    ];

    const createdCategories = await db.insert(categories).values(categoryData).returning({ id: categories.id });
    console.log('✅ Categories created:', createdCategories.length);

    // Create sample products
    const productData = [
      {
        title: 'Modern UI Kit',
        description: 'A comprehensive UI kit for modern web applications',
        price: '29.99',
        categoryId: createdCategories[1].id, // Templates
        category: 'Templates',
        tags: ['ui', 'kit', 'modern', 'web'],
        imageUrl: '/images/products/ui-kit.jpg',
        isActive: true,
        createdBy: adminUser.id,
      },
      {
        title: 'Minimalist Icon Pack',
        description: 'Clean and minimalist icon collection for your projects',
        price: '19.99',
        categoryId: createdCategories[3].id, // Icons
        category: 'Icons',
        tags: ['icons', 'minimalist', 'clean', 'vector'],
        imageUrl: '/images/products/icon-pack.jpg',
        isActive: true,
        createdBy: adminUser.id,
      },
    ];

    const createdProducts = await db.insert(products).values(productData).returning({ id: products.id });
    console.log('✅ Sample products created:', createdProducts.length);

    // Create default settings
    const settingsData = [
      {
        key: 'site_name',
        value: 'FlatMarket',
        description: 'Website name',
        category: 'general',
        isPublic: true,
        updatedBy: adminUser.id,
      },
      {
        key: 'site_description',
        value: 'Digital marketplace for creative assets',
        description: 'Website description',
        category: 'general',
        isPublic: true,
        updatedBy: adminUser.id,
      },
      {
        key: 'currency',
        value: 'USD',
        description: 'Default currency',
        category: 'general',
        isPublic: true,
        updatedBy: adminUser.id,
      },
      {
        key: 'stripe_publishable_key',
        value: '',
        description: 'Stripe publishable key',
        category: 'payment',
        isPublic: false,
        updatedBy: adminUser.id,
      },
      {
        key: 'stripe_secret_key',
        value: '',
        description: 'Stripe secret key',
        category: 'payment',
        isPublic: false,
        updatedBy: adminUser.id,
      },
    ];

    const createdSettings = await db.insert(settings).values(settingsData).returning();
    console.log('✅ Default settings created:', createdSettings.length);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seed().then(() => {
  console.log('Seeding finished. Exiting...');
  process.exit(0);
}).catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});

export { seed };