"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/infrastructure/auth/auth";
import { container } from "@/infrastructure/container";
import { EventFormat } from "@/core/domain/event/event-format";
import { DomainError } from "@/core/domain/shared/errors";
import { parseDateTime } from "@/presentation/lib/datetime";

export interface EventFormState {
  error?: string;
  ok?: boolean;
}

const schema = z.object({
  title: z.string().trim().min(3, "Informe um nome com ao menos 3 caracteres."),
  description: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  format: z.nativeEnum(EventFormat).optional(),
  location: z.string().trim().optional(),
  date: z.string().trim(),
  time: z.string().trim().optional(),
  capacity: z.string().trim().optional().transform(v => v ? parseInt(v, 10) : undefined).refine(v => v === undefined || v > 0, "Capacidade deve ser maior que 0"),
  coverImage: z.string().optional(),
});

export async function createEventAction(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const startsAt = parseDateTime(parsed.data.date, parsed.data.time);
  if (!startsAt) return { error: "Data ou horário inválidos (use dd/mm/aaaa e hh:mm)." };

  try {
    await container.createEvent.execute({
      title: parsed.data.title,
      description: parsed.data.description || null,
      categoryId: parsed.data.categoryId || null,
      format: parsed.data.format,
      location: parsed.data.location || null,
      startsAt,
      capacity: parsed.data.capacity ?? null,
      coverImage: parsed.data.coverImage || null,
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  return { ok: true };
}

export async function updateEventAction(
  id: string,
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sessão expirada. Entre novamente." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };

  const startsAt = parseDateTime(parsed.data.date, parsed.data.time);
  if (!startsAt) return { error: "Data ou horário inválidos (use dd/mm/aaaa e hh:mm)." };

  try {
    await container.updateEvent.execute({
      id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      categoryId: parsed.data.categoryId || null,
      format: parsed.data.format,
      location: parsed.data.location || null,
      startsAt,
      capacity: parsed.data.capacity ?? null,
      coverImage: parsed.data.coverImage || null,
    });
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    throw error;
  }

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  redirect("/admin/eventos?toast=event-updated");
}

export async function deleteEventAction(id: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await container.deleteEvent.execute(id);
  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
}
