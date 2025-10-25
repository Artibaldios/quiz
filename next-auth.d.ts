import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    access_token?: string;
    user?: {
      id: string;
      // add other custom user properties here
    } & DefaultSession["user"];
  }
}