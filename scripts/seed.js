const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin!123', 10);
    
    const adminUserResult = await sql`
      INSERT INTO users (email, name, password, role)
      VALUES (${process.env.ADMIN_USERNAME || 'admin@dama.com'}, 'Admin User', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email
    `;

    let adminUser = adminUserResult[0];
    if (adminUser) {
      console.log('✅ Admin user created:', adminUser.email);
    } else {
      console.log('ℹ️ Admin user already exists');
      const existingUser = await sql`SELECT id, email FROM users WHERE email = ${process.env.ADMIN_USERNAME || 'admin@dama.com'}`;
      adminUser = existingUser[0];
    }

    // Create default categories
    const categoryData = [
      { name: 'Digital Art', description: 'Digital artwork, illustrations, and graphics', slug: 'digital-art', sortOrder: 1 },
      { name: 'Templates', description: 'Website templates, design templates, and layouts', slug: 'templates', sortOrder: 2 },
      { name: 'Fonts', description: 'Typography and font collections', slug: 'fonts', sortOrder: 3 },
      { name: 'Icons', description: 'Icon sets and symbol collections', slug: 'icons', sortOrder: 4 },
      { name: 'Photos', description: 'Stock photos and photography', slug: 'photos', sortOrder: 5 },
    ];

    for (const category of categoryData) {
      await sql`
        INSERT INTO categories (name, description, slug, is_active, sort_order)
        VALUES (${category.name}, ${category.description}, ${category.slug}, true, ${category.sortOrder})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log('✅ Categories created');

    // Get category IDs
    const templatesCategory = await sql`SELECT id FROM categories WHERE slug = 'templates'`;
    const iconsCategory = await sql`SELECT id FROM categories WHERE slug = 'icons'`;

    // Create sample products
    if (templatesCategory[0] && iconsCategory[0]) {
      // Check if products already exist
      const existingProducts = await sql`SELECT title FROM products WHERE title IN ('Modern UI Kit', 'Minimalist Icon Pack')`;
      
      if (existingProducts.length === 0) {
        await sql`
          INSERT INTO products (title, description, price, category_id, category, tags, image_url, file_url, file_name, file_size, created_by)
          VALUES 
            ('Modern UI Kit', 'A comprehensive UI kit for modern web applications', 29.99, ${templatesCategory[0].id}, 'Templates', '[]'::jsonb, '/images/products/ui-kit.jpg', '/files/ui-kit.zip', 'modern-ui-kit.zip', 15728640, ${adminUser.id}),
            ('Minimalist Icon Pack', 'Clean and minimalist icon collection for your projects', 19.99, ${iconsCategory[0].id}, 'Icons', '[]'::jsonb, '/images/products/icon-pack.jpg', '/files/icon-pack.zip', 'minimalist-icons.zip', 5242880, ${adminUser.id})
        `;
        console.log('✅ Sample products created');
      } else {
        console.log('ℹ️ Sample products already exist');
      }
    }

    // Create default settings
    const settingsData = [
      { key: 'site_name', value: '"FlatMarket"', description: 'Website name', category: 'general', isPublic: true },
      { key: 'site_description', value: '"Digital marketplace for creative assets"', description: 'Website description', category: 'general', isPublic: true },
      { key: 'currency', value: '"USD"', description: 'Default currency', category: 'general', isPublic: true },
      { key: 'stripe_publishable_key', value: '""', description: 'Stripe publishable key', category: 'payment', isPublic: false },
      { key: 'stripe_secret_key', value: '""', description: 'Stripe secret key', category: 'payment', isPublic: false },
    ];

    for (const setting of settingsData) {
      await sql`
        INSERT INTO settings (key, value, description, category, is_public, updated_by)
        VALUES (${setting.key}, ${setting.value}::jsonb, ${setting.description}, ${setting.category}, ${setting.isPublic}, ${adminUser.id})
        ON CONFLICT (key) DO NOTHING
      `;
    }
    console.log('✅ Default settings created');

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