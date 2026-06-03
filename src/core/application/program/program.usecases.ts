import { NotFoundError } from "@/core/domain/shared/errors";
import { ProgramSession } from "@/core/domain/program/program-session.entity";
import {
  ProgramSessionRepository,
  SessionView,
} from "@/core/domain/program/program-session.repository";
import { SessionStatus } from "@/core/domain/program/session-status";
import { IdGenerator } from "../ports/id-generator";

export interface CreateSessionDTO {
  title: string;
  description?: string | null;
  speaker?: string | null;
  speakerRole?: string | null;
  categoryId?: string | null;
  startsAt: Date;
  durationMin?: number;
  status?: SessionStatus;
  link?: string | null;
}

export type UpdateSessionDTO = CreateSessionDTO & { id: string };

export class CreateSessionUseCase {
  constructor(
    private readonly repo: ProgramSessionRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(dto: CreateSessionDTO): Promise<{ id: string }> {
    const session = ProgramSession.create({ id: this.ids.generate(), ...dto });
    await this.repo.save(session);
    return { id: session.id };
  }
}

export class UpdateSessionUseCase {
  constructor(private readonly repo: ProgramSessionRepository) {}

  async execute({ id, ...patch }: UpdateSessionDTO): Promise<void> {
    const session = await this.repo.findById(id);
    if (!session) throw new NotFoundError("Sessão", id);
    session.update(patch);
    await this.repo.save(session);
  }
}

export class DeleteSessionUseCase {
  constructor(private readonly repo: ProgramSessionRepository) {}

  async execute(id: string): Promise<void> {
    const session = await this.repo.findById(id);
    if (!session) throw new NotFoundError("Sessão", id);
    await this.repo.delete(id);
  }
}

export class ListSessionsUseCase {
  constructor(private readonly repo: ProgramSessionRepository) {}

  execute(): Promise<SessionView[]> {
    return this.repo.list();
  }
}
