import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    passwordChangeRequired?: boolean;
  }
  interface Session {
    user: {
      role?: string;
      passwordChangeRequired?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    passwordChangeRequired?: boolean;
  }
}
