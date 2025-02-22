import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth/next';

const prisma = new PrismaClient();

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET must be set');
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Informations de connexion manquantes');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          throw new Error('Utilisateur non trouvé');
        }

        if (!user.isActive) {
          throw new Error('Compte désactivé');
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Mot de passe incorrect');
        }

        if (user.role === 'STUDENT') {
          throw new Error('Accès non autorisé');
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si l'URL est déjà une URL complète et commence par le baseUrl
      if (url.startsWith(baseUrl)) {
        const path = url.substring(baseUrl.length);
        // Éviter les boucles de redirection vers la page de connexion
        if (path.startsWith('/auth/login')) {
          return `${baseUrl}/teacher/dashboard`;
        }
        return url;
      }
      // Si c'est un chemin relatif
      if (url.startsWith('/')) {
        // Éviter les boucles de redirection vers la page de connexion
        if (url.startsWith('/auth/login')) {
          return `${baseUrl}/teacher/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      // Pour toute autre URL, rediriger vers le tableau de bord
      return `${baseUrl}/teacher/dashboard`;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 