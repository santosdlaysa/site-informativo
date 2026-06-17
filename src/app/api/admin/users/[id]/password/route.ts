import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { BcryptPasswordHasher } from "@/infrastructure/auth/bcrypt-password-hasher";
import { prisma } from "@/infrastructure/database/prisma";

const schema = z
  .object({
    newPassword: z.string().min(6, "A nova senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "A confirmação não confere com a nova senha.",
    path: ["confirmPassword"],
  });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  const { id } = await params;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  try {
    const hasher = new BcryptPasswordHasher();
    const passwordHash = await hasher.hash(parsed.data.newPassword);
    await prisma.user.update({
      where: { id },
      data: { passwordHash, passwordChangeRequired: false },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar senha." }, { status: 500 });
  }

  revalidatePath("/admin/editores");
  return NextResponse.json({ success: true });
}
