import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

import {
  login,
  // nextAuthOauthLogin,
  getUserByEmail,
  getUserByProviderAndProviderAccountId,
} from "@/api/auth";
import { ProfileApi } from "@/libs/axios";

export default NextAuth({
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    // maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/",
    newUser: "/auth/signup",
  },
  debug: process.env.NODE_ENV === "development",
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "tallstrike",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const body = {
          email: credentials?.email,
          password: credentials?.password,
        };

        try {
          const response = await login(body);
          const { user, access } = response?.data;

          const userInfo = await ProfileApi(access).getUser({ id: user.id });
          const { data: userData } = userInfo;

          const userObj = { ...userData, ...userData, access };
          return userObj;
        } catch (error) {
          const data = (error as any).response.data;
          throw new Error(data.message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      // authorization: {
      //   params: {
      //     prompt: 'consent',
      //     access_type: 'offline',
      //     response_type: 'code',
      //   },
      // },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user && account && account.type === "credentials") {
        if (user) {
          const { accessToken, ...rest } = user;
          token.accessToken = accessToken;
          token.accessTokenExpiry = Date.now() + 7 * 24 * 60 * 60;
          token.user = rest;
        }

        return token;
      }

      if (
        account &&
        account.type === "oauth" &&
        account.providerAccountId &&
        account.provider
      ) {
        const response = await getUserByProviderAndProviderAccountId({
          providerAccountId: account.providerAccountId,
          provider: account.provider,
        });

        const { user: userExists, token: userExistsToken } =
          response?.data?.data;

        if (!userExists) {
          // find user by email
          const response = await getUserByEmail(token.email as string);
          const { user: userByEmail, token: userByEmailToken } =
            response?.data?.data;

          if (!userByEmail) {
            return token;
          }
          return {
            id: userByEmail.id,
            name: userByEmail.name,
            username: userByEmail.username,
            role: userByEmail.role,
            email: userByEmail.email,
            accessToken: userByEmailToken.accessToken,
          };
        }

        return {
          id: userExists.id,
          name: userExists.name,
          username: userExists.username,
          role: userExists.role,
          email: userExists.email,
          accessToken: userExistsToken.accessToken,
        };
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.expires = (Date.now() + 7 * 24 * 60 * 60)?.toString();

      session.user = {
        ...session.user,
        ...Object(token.user),
      };

      return session;
    },
    async signIn({ user, account }) {
      if (account?.type === "credentials") {
        account.access_token = user?.accessToken as string;
        return true;
      }

      if (account?.provider === "email") {
        return true;
      }

      // if (account.type === 'oauth') {
      //   try {
      //     const response = await nextAuthOauthLogin(user, account, profile);
      //     return response.data.data;
      //   } catch (error) {
      //     return '/auth/error?error=server-error';
      //   }
      // }

      return false;
    },
  },
});
