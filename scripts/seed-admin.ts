import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { users } from '../src/lib/db/schema.ts';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  try {
    // Initialize database connection
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    // Get admin credentials from environment
    const adminUsername = process.env.ADMIN_USERNAME || 'admin@dama.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminUsername))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists:', adminUsername);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const newAdmin = await db
      .insert(users)
      .values({
        email: adminUsername,
        name: 'Administrator',
        password: hashedPassword,
        role: 'admin',
      })
      .returning();

    console.log('Admin user created successfully:');
    console.log('Email:', adminUsername);
    console.log('Password:', adminPassword);
    console.log('Role: admin');
    console.log('\nYou can now login to the admin panel with these credentials.');

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

seedAdmin();