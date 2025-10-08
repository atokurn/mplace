import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Lazy-load DB only when authorize is invoked, avoiding import during session fetch
          const { db } = await import('./db');
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user[0]) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user[0].password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
            avatar: user[0].avatar,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'id' in user) {
        token.id = (user as { id: string }).id;
      }
      if (user && 'role' in user) {
        token.role = (user as { role?: string | null }).role ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      const mutable = session.user as import('next-auth').DefaultSession['user'] & {
        id?: string;
        role?: string | null;
      };
      if (typeof token.id === 'string') {
        mutable.id = token.id;
      }
      mutable.role = typeof token.role === 'string' ? token.role : null;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export type SessionUser = { id?: string; role?: string | null } | undefined | null;
export const isAdmin = (user: SessionUser): boolean => {
  return (user?.role ?? null) === 'admin';
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12);
};