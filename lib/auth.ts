import { PrismaAdapter } from '@auth/prisma-adapter';
import { getServerSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { database } from '~/lib/database';
import { env } from '~/lib/env.mjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(database),
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      const existingUser = await database.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!existingUser) {
        token.id = user.id;
        return token;
      }

      return {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        picture: existingUser.image,
      };
    },
  },
};

export async function auth() {
  const session = await getServerSession(authOptions);

  if (session === null) {
    return {
      isAuthenticated: false,
      user: null,
    } as const;
  }

  return {
    isAuthenticated: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  } as const;
}
