import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import type { SessionStrategy } from "next-auth"
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "your username" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const user = await prisma.user.findFirst({
          where: {
            name: credentials.username,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Prevent recursive callbackUrl appending
      if (url.includes("callbackUrl=")) {
        const urlObj = new URL(url);
        const originalCallbackUrl = urlObj.searchParams.get("callbackUrl");
        if (originalCallbackUrl) return originalCallbackUrl;
      }
      if (url.startsWith("/")) return baseUrl + url;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt: async ({ token, user }: { token: JWT; user?: { id: string } }) => {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },

    session: async ({ session, token }: {
      session: DefaultSession & { user: { id?: string } };
      token: JWT & { id?: string }
    }) => {
      if (token?.id && session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: `/en/login`,
    signOut: "/en/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const authHandler = NextAuth(authOptions);

export const GET = authHandler;
export const POST = authHandler;