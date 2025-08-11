import "server-only";
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const config: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
       credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        // Démo : remplacer par vraie vérif DB + hash
        if (email === "demo@acme.com" && password === "password123") {
          return { id: "1", email, name: "Demo User" };
        }
        return null;
      },
    }),
  ],
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);