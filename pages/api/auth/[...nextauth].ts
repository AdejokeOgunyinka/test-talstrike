import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

import { login, tryFacebookSSO, tryGoogleSSO } from "@/api/auth";
import { ProfileApi } from "@/libs/axios";

export default NextAuth({
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/signup",
  },
  debug: process.env.NODE_ENV === "development",
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "talstrike",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
        user: {label: "User", type: "text"}
      },

      async authorize(credentials, req) {
        const body = {
          email: credentials?.email,
          password: credentials?.password,
        };

        if(credentials?.user) {
          const newUser = JSON.parse(credentials?.user);
          const userInfo = await ProfileApi(newUser?.access).getUser({ id: newUser?.id });
          const { data: userData } = userInfo;

          const userObj = { ...userData, ...userData, access: newUser?.access };
          return userObj;     
        } else {
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
        }
      },
    }),
    GoogleProvider({
      name: "Next auth 13",
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, session }) {
      if (user && account && account.type === "credentials") {
        if (user) {
          const { accessToken, ...rest } = user;
          token.accessToken = accessToken;
          token.accessTokenExpiry = Date.now() + 7 * 24 * 60 * 60;
          token.user = rest;
        }

        return token;
      }

      if (account?.provider === "google") {
        try {
          const response = await tryGoogleSSO(account?.id_token as string);
          if (response?.user) {
            const { accessToken, image, ...rest } = response?.user;
            token.accessToken = response?.access;
            token.accessTokenExpiry = Date.now() + 7 * 24 * 60 * 60;
            token.user = { ...rest, picture: image, access: response?.access };
          } else {
            token.user = {};
          }
        } catch (err: any) {
          token.user = {};
        }
      }

      if (account?.provider === "facebook") {
        console.log({ account });
        try {
          const response = await tryFacebookSSO(
            account?.access_token as string
          );
          console.log({ response });
          if (response?.user) {
            const { accessToken, image, ...rest } = response?.user;
            token.accessToken = response?.access;
            token.accessTokenExpiry = Date.now() + 7 * 24 * 60 * 60;
            token.user = { ...rest, picture: image, access: response?.access };
          } else {
            token.user = {};
          }
        } catch (err: any) {
          token.user = {};
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
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

      if (account?.provider === "google") {
        return true;
      }

      if (account?.provider === "facebook") {
        return true;
      }

      return false;
    },
  },
});
