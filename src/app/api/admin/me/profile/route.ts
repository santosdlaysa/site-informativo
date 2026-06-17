import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { DomainError } from "@/core/domain/shared/errors";

const schema = z.object({
  name: z.string().trim().min(2, "O nome deve ter ao menos 2 caracteres."),
  bio: z.string().trim().optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  try {
    await container.updateProfile.execute(session.user.id, {
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
