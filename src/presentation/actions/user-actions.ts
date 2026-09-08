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
  // A tela "Usuários" escolhe os sites no formulário; nas demais vale a empresa ativa.
  const requestedCompanyIds = formData.getAll("companyIds").map((value) => String(value).trim()).filter(Boolean);
  let companyId = await getActiveCompanyId();
  let accessCompanyIds: string[] = [];
  if (requestedCompanyIds.length > 0) {
    const found = await prisma.company.findMany({
      where: { id: { in: requestedCompanyIds } },
      orderBy: { name: "asc" },
      select: { id: true },
    });
    if (found.length !== new Set(requestedCompanyIds).size) return { error: "Site não encontrado." };
    accessCompanyIds = found.map((company) => company.id);
    // O primeiro site marcado vira o padrão (onde o usuário entra ao logar).
    companyId = accessCompanyIds[0] ?? companyId;
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

  let created;
  try {
    created = await container.createUser.execute(
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

  const accesses = accessCompanyIds.length > 0 ? accessCompanyIds : [companyId];
  await prisma.userCompanyAccess.createMany({
    data: accesses.map((id) => ({ userId: created.id, companyId: id })),
    skipDuplicates: true,
  });

  revalidatePath("/admin/editores");
  revalidatePath("/admin/usuarios");
  return { success: true };
}

/** Define em quais sites o usuário entra (seletor da tela "Usuários"). */
export async function updateUserCompaniesAction(userId: string, companyIds: string[]): Promise<UserFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };
  if (session.user.role !== "admin") return { error: "Apenas o administrador pode alterar os sites do usuário." };
  if (userId === session.user.id) return { error: "Você não pode alterar os sites da sua própria conta." };

  const requested = [...new Set(companyIds.map((id) => id.trim()).filter(Boolean))];
  if (requested.length === 0) return { error: "Selecione pelo menos um site." };

  const [user, companies] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, companyId: true, companyAccesses: { select: { companyId: true } } },
    }),
    prisma.company.findMany({ where: { id: { in: requested } }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!user) return { error: "Usuário não encontrado." };
  if (companies.length !== requested.length) return { error: "Site não encontrado." };

  const current = new Set([user.companyId, ...user.companyAccesses.map((access) => access.companyId)]);
  for (const company of companies) {
    if (current.has(company.id)) continue;
    const total = await countUsersWithAccess(company.id);
    if (total >= MAX_USERS_PER_COMPANY) {
      return { error: `O ${company.name} já tem ${MAX_USERS_PER_COMPANY} usuários.` };
    }
  }

  const ids = companies.map((company) => company.id);
  await prisma.$transaction([
    prisma.userCompanyAccess.deleteMany({ where: { userId, companyId: { notIn: ids } } }),
    prisma.userCompanyAccess.createMany({
      data: ids.map((companyId) => ({ userId, companyId })),
      skipDuplicates: true,
    }),
    // O site padrão precisa continuar entre os liberados.
    prisma.user.update({
      where: { id: userId },
      data: { companyId: ids.includes(user.companyId) ? user.companyId : ids[0] },
    }),
  ]);

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/editores");
  return { success: true };
}

/** Quantos usuários já acessam um site (site padrão ou acesso extra). */
async function countUsersWithAccess(companyId: string): Promise<number> {
  return prisma.user.count({
    where: { OR: [{ companyId }, { companyAccesses: { some: { companyId } } }] },
  });
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
