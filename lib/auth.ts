import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { libsql as client } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
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

        const adminUser = process.env.ADMIN_USERNAME;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        console.log(`[Auth Check] User: ${credentials.username} | Env Set: ${!!adminUser}`);

        // 1. FAST PRIMARY CHECK: Environment Variables
        // This is prioritized because it's instantaneous and bypasses DB connectivity issues.
        if (adminUser && credentials.username === adminUser) {
           console.log("[Auth] Matching against environment credentials...");
           const isValid = await compare(credentials.password, adminHash || "");
           if (isValid) {
             console.log("[Auth] Environment login SUCCESS");
             return { 
               id: "env-admin", 
               name: "Admin (Secure-Env)", 
               email: "admin@satyacomputers.com",
               role: "admin"
             };
           }
           console.log("[Auth] Environment password mismatch");
        }

        // 2. SECONDARY CHECK: Database
        try {
          console.log("[Auth] Checking database-based credentials...");
          // Added a small timeout signal or just rely on the user seeing the fallback
          const result = await client.execute({
            sql: 'SELECT id, username, password, role FROM "Admin" WHERE username = ?',
            args: [credentials.username]
          });

          if (result.rows && result.rows.length > 0) {
            const dbAdmin = result.rows[0];
            const isValid = await compare(credentials.password, dbAdmin.password as string);
            if (isValid) {
              console.log("[Auth] Database login successful.");
              return { 
                id: String(dbAdmin.id), 
                name: "Admin", 
                email: "admin@satyacomputers.com",
                role: String(dbAdmin.role)
              };
            }
          }
        } catch (dbError) {
          console.error("[Auth] Database Auth Error:", dbError);
        }

        console.log("[Auth] All authentication methods failed.");
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
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
