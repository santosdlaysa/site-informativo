import type { ProgramSession as PrismaSession } from "@prisma/client";
import { ProgramSession } from "@/core/domain/program/program-session.entity";
import {
  ProgramSessionRepository,
  SessionView,
} from "@/core/domain/program/program-session.repository";
import { SessionStatus } from "@/core/domain/program/session-status";
import { prisma } from "../prisma";

function toDomain(row: PrismaSession): ProgramSession {
  return ProgramSession.restore({
    id: row.id,
    title: row.title,
    description: row.description,
    speaker: row.speaker,
    speakerRole: row.speakerRole,
    category: row.category,
    startsAt: row.startsAt,
    durationMin: row.durationMin,
    status: row.status as SessionStatus,
    link: row.link,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

function toView(row: PrismaSession): SessionView {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    speaker: row.speaker,
    speakerRole: row.speakerRole,
    category: row.category,
    startsAt: row.startsAt,
    durationMin: row.durationMin,
    status: row.status as SessionStatus,
    link: row.link,
  };
}

export class PrismaProgramSessionRepository implements ProgramSessionRepository {
  async save(session: ProgramSession): Promise<void> {
    const s = session.toSnapshot();
    const data = {
      id: s.id,
      title: s.title,
      description: s.description,
      speaker: s.speaker,
      speakerRole: s.speakerRole,
      category: s.category,
      startsAt: s.startsAt,
      durationMin: s.durationMin,
      status: s.status,
      link: s.link,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
    await prisma.programSession.upsert({ where: { id: s.id }, create: data, update: data });
  }

  async delete(id: string): Promise<void> {
    await prisma.programSession.delete({ where: { id } });
  }

  async findById(id: string): Promise<ProgramSession | null> {
    const row = await prisma.programSession.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async list(): Promise<SessionView[]> {
    const rows = await prisma.programSession.findMany({ orderBy: { startsAt: "asc" } });
    return rows.map(toView);
  }
}
