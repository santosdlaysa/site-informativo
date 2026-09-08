import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { prisma } from "@/infrastructure/database/prisma";
import { DomainError } from "@/core/domain/shared/errors";
import { getActiveCompanyId } from "@/infrastructure/tenant";

const schema = z.object({
  name: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres."),
  bio: z.string().trim().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
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
  const companyId = await getActiveCompanyId();

  const { id } = await params;

  const target = await prisma.user.findFirst({
    where: { id, companyId },
    select: { id: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  try {
    await container.updateProfile.execute(id, {
      name: parsed.data.name,
      bio: parsed.data.bio || null,
      avatar: parsed.data.avatar || null,
    });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }

  revalidatePath("/posts", "layout");
  revalidatePath("/admin/editores");
  return NextResponse.json({ success: true });
}
