"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { DomainError } from "@/core/domain/shared/errors";
import { USER_ROLES } from "@/core/domain/user/user-role";
import { getActiveCompanyId } from "@/infrastructure/tenant";
import { prisma } from "@/infrastructure/database/prisma";

export interface UserFormState {
  error?: string;
  success?: boolean;
}

/** Mesmo limite aplicado pelo CreateUserUseCase. */
const MAX_USERS_PER_COMPANY = 3;

const createSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres."),
  email: z.string().trim().email("E-mail inválido."),
  role: z.enum(USER_ROLES).default("editor"),
  password: z.string().refine(
    (value) => value === "teste" || value.length >= 6,
    "A senha deve ter ao menos 6 caracteres, exceto a senha temporária teste.",
  ),
});

export async function createUserAction(
  _prev: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (session.user.role !== "admin") return { error: "Apenas o administrador pode criar editores." };
  // A tela "Usuários" escolhe o site no formulário; nas demais vale a empresa ativa.
  const requestedCompanyId = String(formData.get("companyId") ?? "").trim();
  let companyId = await getActiveCompanyId();
  if (requestedCompanyId) {
    const company = await prisma.company.findUnique({ where: { id: requestedCompanyId }, select: { id: true } });
    if (!company) return { error: "Site não encontrado." };
    companyId = company.id;
  }

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role") || "editor",
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  try {
    await container.createUser.execute(
      parsed.data.name,
      parsed.data.email,
      parsed.data.password,
      parsed.data.role,
      companyId,
    );
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/editores");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

/** Move um usuário para outro site (usado pelo seletor da tela "Usuários"). */
export async function updateUserCompanyAction(userId: string, companyId: string): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (session.user.role !== "admin") return { error: "Apenas o administrador pode alterar o site do usuário." };
  if (userId === session.user.id) return { error: "Você não pode alterar o site da sua própria conta." };

  const [user, company] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, companyId: true } }),
    prisma.company.findUnique({ where: { id: companyId }, select: { id: true, name: true } }),
  ]);
  if (!user) return { error: "Usuário não encontrado." };
  if (!company) return { error: "Site não encontrado." };
  if (user.companyId === company.id) return { success: true };

  const total = await prisma.user.count({ where: { companyId: company.id } });
  if (total >= MAX_USERS_PER_COMPANY) {
    return { error: `O ${company.name} já tem ${MAX_USERS_PER_COMPANY} usuários.` };
  }

  await prisma.user.update({ where: { id: userId }, data: { companyId: company.id } });
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/editores");
  return { success: true };
}

export async function deleteUserAction(id: string): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (session.user.role !== "admin") return { error: "Apenas o administrador pode remover editores." };
  const companyId = await getActiveCompanyId();

  try {
    await container.deleteUser.execute(id, session.user.id, session.user.role ?? "editor", companyId);
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/editores");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

/** Remove um usuário de qualquer site (tela "Usuários"). */
export async function deleteAnyUserAction(id: string): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (session.user.role !== "admin") return { error: "Apenas o administrador pode remover usuários." };

  const target = await prisma.user.findUnique({ where: { id }, select: { companyId: true } });
  if (!target) return { error: "Usuário não encontrado." };

  try {
    await container.deleteUser.execute(id, session.user.id, session.user.role ?? "editor", target.companyId);
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/editores");
  return { success: true };
}
