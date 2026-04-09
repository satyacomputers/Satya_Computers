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

        console.log(`[Auth] Attempting login for user: ${credentials.username}`);

        // 1. Fast Primary Check: Fallback to .env (Always works if env vars are present)
        if (credentials.username === process.env.ADMIN_USERNAME && process.env.ADMIN_USERNAME) {
           console.log("[Auth] Checking environment-based credentials...");
           try {
             const isValid = await compare(credentials.password, process.env.ADMIN_PASSWORD_HASH || "");
             if (isValid) {
               console.log("[Auth] Environment-based login successful.");
               return { 
                 id: "env-admin", 
                 name: "Admin (Secure-Env)", 
                 email: "admin@satyacomputers.com",
                 role: "admin"
               };
             }
             console.log("[Auth] Environment password mismatch.");
           } catch (compareErr) {
             console.error("[Auth] Compare error:", compareErr);
           }
        }

        // 2. Secondary Check: Database (Might be slow or hang in production)
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
