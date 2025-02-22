import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  }
  
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  }
} 