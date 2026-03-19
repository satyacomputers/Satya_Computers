import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma, { libsql as client } from "@/lib/prisma";

const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const result = await client.execute({
            sql: 'SELECT id, username, password, role FROM "Admin" WHERE username = ?',
            args: [credentials.username]
          });

          if (result.rows && result.rows.length > 0) {
            const dbAdmin = result.rows[0];
            const isValid = await compare(credentials.password, dbAdmin.password as string);
            if (isValid) {
              return { 
                id: dbAdmin.id as string, 
                name: "Admin", 
                email: "admin@satyacomputers.com",
                role: dbAdmin.role as string
              };
            }
          }
        } catch (dbError) {
          console.error("Auth DB Error:", dbError);
        }

        // Fallback to .env
        if (credentials.username === process.env.ADMIN_USERNAME) {
          const isValid = await compare(credentials.password, process.env.ADMIN_PASSWORD_HASH || "");
          if (isValid) {
            return { 
              id: "1", 
              name: "Admin (Env)", 
              email: "admin@satyacomputers.com",
              role: "admin"
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
