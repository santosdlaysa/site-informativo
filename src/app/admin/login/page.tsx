import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/infrastructure/auth/auth";
import { LoginForm } from "@/presentation/components/admin/login-form";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin/posts");
  return <LoginForm />;
}
