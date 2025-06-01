# Database Schema Documentation

This document describes the database schema for the FlatMarket application.

## Overview

The database uses PostgreSQL with Drizzle ORM and includes the following tables:

- **users** - User accounts and authentication
- **categories** - Product categories
- **products** - Digital products for sale
- **reviews** - Product reviews and ratings
- **downloads** - Track user downloads
- **orders** - Purchase orders
- **order_items** - Items within each order
- **promotions** - Discount codes and promotions
- **promotion_usage** - Track promotion usage
- **analytics_events** - User behavior tracking
- **settings** - Application configuration

## Table Schemas

### Users
Stores user account information including authentication details.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' NOT NULL, -- 'user' | 'admin'
  avatar TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);
```

### Categories
Product categories for organizing digital assets.

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);
```

### Products
Digital products available for purchase.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  category TEXT NOT NULL, -- For backward compatibility
  tags JSONB DEFAULT '[]',
  image_url TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  download_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);
```

### Orders
Customer purchase orders.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD' NOT NULL,
  payment_method TEXT, -- 'stripe' | 'paypal' | 'crypto'
  payment_status TEXT DEFAULT 'pending' NOT NULL, -- 'pending' | 'paid' | 'failed' | 'refunded'
  payment_id TEXT, -- External payment provider ID
  notes TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);
```

### Promotions
Discount codes and promotional campaigns.

```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'percentage' | 'fixed_amount' | 'free_shipping'
  value DECIMAL(10,2) NOT NULL, -- Percentage (0-100) or fixed amount
  minimum_order_amount DECIMAL(10,2),
  max_usage_count INTEGER, -- null = unlimited
  current_usage_count INTEGER DEFAULT 0 NOT NULL,
  max_usage_per_user INTEGER DEFAULT 1 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  starts_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  applicable_products JSONB, -- Product IDs, null = all products
  applicable_categories JSONB, -- Category IDs, null = all categories
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
);
```

## Database Commands

### Setup
```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:push

# Seed database with initial data
npm run db:seed

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Environment Variables
Make sure to set the following in your `.env.local`:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
ADMIN_USERNAME="admin@example.com"
ADMIN_PASSWORD="your-secure-password"
```

## Admin Panel Integration

The database schema supports all admin panel features:

- **Dashboard** - Statistics from orders, products, users, downloads
- **Products** - CRUD operations for digital products
- **Categories** - Manage product categories
- **Orders** - View and manage customer orders
- **Users** - User management and roles
- **Promotions** - Create and manage discount codes
- **Analytics** - Track user behavior and events
- **Settings** - Application configuration

## Relationships

- Products belong to Categories (many-to-one)
- Products are created by Users (many-to-one)
- Orders belong to Users (many-to-one)
- Order Items belong to Orders and Products (many-to-one each)
- Reviews belong to Products and Users (many-to-one each)
- Downloads track Products downloaded by Users
- Promotions track usage by Users in Orders
- Analytics Events can reference Users, Products, and Orders

## Data Types

- **UUID** - Primary keys and foreign keys
- **TEXT** - String fields
- **DECIMAL(10,2)** - Monetary values
- **INTEGER** - Numeric values
- **BOOLEAN** - True/false flags
- **TIMESTAMP** - Date and time values
- **JSONB** - JSON data (tags, metadata, settings)

## Indexes

The schema includes automatic indexes on:
- Primary keys (UUID)
- Foreign key relationships
- Unique constraints (email, slug, code, etc.)

Additional indexes can be added for performance optimization as needed.