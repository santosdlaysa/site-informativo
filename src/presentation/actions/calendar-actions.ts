"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { parseDateTime } from "@/presentation/lib/datetime";

export interface CalendarFormState {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  title: z.string().trim().min(2, "Informe um nome com ao menos 2 caracteres."),
  date: z.string().trim(),
  color: z.string().trim().default("purple"),
  description: z.string().trim().optional(),
});

export async function createCalendarDateAction(
  _prev: CalendarFormState,
  formData: FormData,
): Promise<CalendarFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const date = parseDateTime(parsed.data.date);
  if (!date) return { error: "Data inválida (use dd/mm/aaaa)." };

  await container.createCalendarDate.execute({
    title: parsed.data.title,
    date,
    color: parsed.data.color,
    description: parsed.data.description || null,
  });

  revalidatePath("/admin/calendario");
  revalidatePath("/");
  return { ok: true };
}

export async function updateCalendarDateAction(
  id: string,
  _prev: CalendarFormState,
  formData: FormData,
): Promise<CalendarFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const date = parseDateTime(parsed.data.date);
  if (!date) return { error: "Data inválida (use dd/mm/aaaa)." };

  await container.updateCalendarDate.execute(id, {
    title: parsed.data.title,
    date,
    color: parsed.data.color,
    description: parsed.data.description || null,
  });

  revalidatePath("/admin/calendario");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCalendarDateAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await container.deleteCalendarDate.execute(id);
  revalidatePath("/admin/calendario");
  revalidatePath("/");
}
