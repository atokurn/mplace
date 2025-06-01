# Backend Setup Guide

This guide will help you set up the backend infrastructure for the PIXEL Digital Marketplace including database, ORM, authentication, and file storage.

## 🛠️ Tech Stack

- **Backend**: Next.js API Routes
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js with custom roles
- **File Storage**: Cloudflare R2 (S3-compatible)

## 📋 Prerequisites

1. Node.js 18+ installed
2. Neon PostgreSQL database account
3. Cloudflare account with R2 storage

## 🚀 Setup Instructions

### 1. Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudflare R2 Storage
R2_ACCOUNT_ID="your-cloudflare-account-id"
R2_ACCESS_KEY_ID="your-r2-access-key-id"
R2_SECRET_ACCESS_KEY="your-r2-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
R2_PUBLIC_URL="https://your-custom-domain.com" # Optional
```

### 2. Database Setup (Neon PostgreSQL)

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and create an account
2. **Create Database**: Create a new PostgreSQL database
3. **Get Connection String**: Copy the connection string from your Neon dashboard
4. **Update DATABASE_URL**: Paste the connection string in your `.env.local`

### 3. Database Schema Migration

Generate and push the database schema:

```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Cloudflare R2 Setup

1. **Create R2 Bucket**:
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Create a new bucket for your files
   - Note the bucket name

2. **Create API Token**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create a custom token with R2 permissions
   - Note the Account ID, Access Key ID, and Secret Access Key

3. **Configure CORS** (Optional):
   ```json
   [
     {
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"]
     }
   ]
   ```

### 5. NextAuth Secret

Generate a secure secret for NextAuth:

```bash
# Generate a random secret
openssl rand -base64 32
```

Add this to your `NEXTAUTH_SECRET` in `.env.local`.

## 🗄️ Database Schema

The database includes the following tables:

- **users**: User accounts with roles (user/admin)
- **products**: Digital products with metadata
- **reviews**: Product reviews and ratings
- **downloads**: Download tracking

## 🔐 Authentication

- **Strategy**: Credentials-based authentication
- **Roles**: `user` and `admin`
- **Protection**: Admin routes are protected by middleware
- **Sessions**: JWT-based sessions

## 📁 File Storage

- **Storage**: Cloudflare R2 (S3-compatible)
- **Upload Method**: Presigned URLs for secure uploads
- **File Types**: Images (PNG, JPG, WebP, SVG) and design files (PDF, EPS)
- **Organization**: Files organized by user ID and timestamp

## 🛡️ API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Products
- `GET /api/products` - List products with filtering
- `POST /api/products` - Create product (admin only)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### File Upload
- `POST /api/upload` - Generate presigned upload URL (admin only)

## 🧪 Testing the Setup

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Database Connection**:
   - Visit `http://localhost:3000/api/products`
   - Should return an empty array or existing products

3. **Test Authentication**:
   - Try accessing admin routes
   - Should redirect to login page

4. **View Database**:
   ```bash
   npm run db:studio
   ```
   - Opens Drizzle Studio to view your database

## 🔧 Available Scripts

```bash
# Database
npm run db:generate    # Generate migration files
npm run db:migrate     # Run migrations
npm run db:push        # Push schema to database
npm run db:studio      # Open Drizzle Studio

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
```

## 🚨 Security Notes

1. **Never commit `.env.local`** to version control
2. **Use strong passwords** for database and API keys
3. **Enable SSL/TLS** for production databases
4. **Regularly rotate** API keys and secrets
5. **Validate all inputs** on both client and server

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your IP is whitelisted in Neon
- Ensure SSL mode is enabled

### File Upload Issues
- Verify R2 credentials are correct
- Check bucket permissions
- Ensure CORS is configured if needed

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure user has correct role for admin routes