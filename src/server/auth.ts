import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";

// import google provider
import GoogleProvider from "next-auth/providers/google";
import { sha256 } from "~/lib/crypto";
import { Prisma } from "~/lib/prisma";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      secret: string | null;
      email: string | null;
      image: string | null;
      name: string | null;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session }) {
      const bearerSecret: string | undefined = process.env.BEARER_SECRET;

      if (!bearerSecret) {
        throw new Error("BEARER_SECRET is not defined");
      }

      if (!session) {
        throw new Error("Session is not defined");
      }

      if (!session.user) {
        throw new Error("User is not defined");
      }

      const email: string | null = session.user.email ?? null;
      const image: string | null = session.user.image ?? null;
      const name: string | null = session.user.name ?? null;
      const secret: string | null = email
        ? await sha256(email + bearerSecret)
        : null;

      session.user = {
        secret,
        email,
        image,
        name,
      };

      // Add the user to the database if they don't already exist
      if (email && secret) {
        Prisma.createUser({
          email,
          secret,
        }).catch(() => {
          return;
        });
      }

      return session;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
