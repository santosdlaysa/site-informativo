import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    companyId?: string;
    passwordChangeRequired?: boolean;
  }
  interface Session {
    user: {
      role?: string;
      companyId?: string;
      passwordChangeRequired?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    companyId?: string;
    passwordChangeRequired?: boolean;
  }
}
