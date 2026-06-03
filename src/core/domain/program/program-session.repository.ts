import { ProgramSession } from "./program-session.entity";
import { SessionStatus } from "./session-status";

export interface SessionView {
  id: string;
  title: string;
  description: string | null;
  speaker: string | null;
  speakerRole: string | null;
  categoryId: string | null;
  categoryName: string | null;
  startsAt: Date;
  durationMin: number;
  status: SessionStatus;
  link: string | null;
}

export interface ProgramSessionRepository {
  save(session: ProgramSession): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<ProgramSession | null>;
  /** Ordenadas por data/hora crescente. */
  list(): Promise<SessionView[]>;
}
