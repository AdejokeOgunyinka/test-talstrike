import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  type DefaultSessionUser = NonNullable<DefaultSession["user"]>;
  type AuthSessionUser = DefaultSessionUser & {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    roles: string[];
    date_joined: string;
    is_active: boolean;
    access: string;
    id_token?: string;
  };
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    accessToken: string;
  }
  interface Session {
    accessToken: string;
    user: AuthSessionUser;
  }
}
