"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { SessionStatus } from "@/core/domain/program/session-status";
import { DomainError } from "@/core/domain/shared/errors";
import { parseDateTime } from "@/presentation/lib/datetime";

export interface SessionFormState {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  title: z.string().trim().min(3, "Informe um título com ao menos 3 caracteres."),
  description: z.string().trim().optional(),
  speaker: z.string().trim().optional(),
  speakerRole: z.string().trim().optional(),
  category: z.string().trim().optional(),
  date: z.string().trim(),
  time: z.string().trim().optional(),
  durationMin: z.coerce.number().int().positive().optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  link: z.string().trim().optional(),
});

export async function createSessionAction(
  _prev: SessionFormState,
  formData: FormData,
): Promise<SessionFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const startsAt = parseDateTime(parsed.data.date, parsed.data.time);
  if (!startsAt) return { error: "Data ou horário inválidos (use dd/mm/aaaa e hh:mm)." };

  try {
    await container.createSession.execute({
      title: parsed.data.title,
      description: parsed.data.description || null,
      speaker: parsed.data.speaker || null,
      speakerRole: parsed.data.speakerRole || null,
      category: parsed.data.category || null,
      startsAt,
      durationMin: parsed.data.durationMin,
      status: parsed.data.status,
      link: parsed.data.link || null,
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/programacao");
  revalidatePath("/programacao");
  return { ok: true };
}

export async function deleteSessionAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await container.deleteSession.execute(id);
  revalidatePath("/admin/programacao");
  revalidatePath("/programacao");
}
