import { ValidationError } from "../shared/errors";
import { SessionStatus } from "./session-status";

export interface ProgramSessionProps {
  id: string;
  title: string;
  description: string | null;
  speaker: string | null;
  speakerRole: string | null;
  category: string | null;
  startsAt: Date;
  durationMin: number;
  status: SessionStatus;
  link: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionInput {
  id: string;
  title: string;
  description?: string | null;
  speaker?: string | null;
  speakerRole?: string | null;
  category?: string | null;
  startsAt: Date;
  durationMin?: number;
  status?: SessionStatus;
  link?: string | null;
  now?: Date;
}

export type UpdateSessionPatch = Partial<Omit<CreateSessionInput, "id" | "now">>;

/** Entidade de uma sessão da agenda (live, workshop, bate-papo). */
export class ProgramSession {
  private constructor(private props: ProgramSessionProps) {}

  static create(input: CreateSessionInput): ProgramSession {
    const title = input.title?.trim() ?? "";
    if (title.length < 3) throw new ValidationError("O título da sessão deve ter ao menos 3 caracteres.");
    if (!(input.startsAt instanceof Date) || Number.isNaN(input.startsAt.getTime())) {
      throw new ValidationError("Data/hora da sessão inválida.");
    }
    const now = input.now ?? new Date();
    return new ProgramSession({
      id: input.id,
      title,
      description: input.description?.trim() || null,
      speaker: input.speaker?.trim() || null,
      speakerRole: input.speakerRole?.trim() || null,
      category: input.category?.trim() || null,
      startsAt: input.startsAt,
      durationMin: input.durationMin && input.durationMin > 0 ? input.durationMin : 60,
      status: input.status ?? SessionStatus.Scheduled,
      link: input.link?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: ProgramSessionProps): ProgramSession {
    return new ProgramSession(props);
  }

  update(patch: UpdateSessionPatch): void {
    if (patch.title !== undefined) {
      const t = patch.title.trim();
      if (t.length < 3) throw new ValidationError("O título da sessão deve ter ao menos 3 caracteres.");
      this.props.title = t;
    }
    if (patch.description !== undefined) this.props.description = patch.description?.trim() || null;
    if (patch.speaker !== undefined) this.props.speaker = patch.speaker?.trim() || null;
    if (patch.speakerRole !== undefined) this.props.speakerRole = patch.speakerRole?.trim() || null;
    if (patch.category !== undefined) this.props.category = patch.category?.trim() || null;
    if (patch.startsAt !== undefined) {
      if (Number.isNaN(patch.startsAt.getTime())) throw new ValidationError("Data/hora inválida.");
      this.props.startsAt = patch.startsAt;
    }
    if (patch.durationMin !== undefined && patch.durationMin > 0) this.props.durationMin = patch.durationMin;
    if (patch.status !== undefined) this.props.status = patch.status;
    if (patch.link !== undefined) this.props.link = patch.link?.trim() || null;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  toSnapshot(): Readonly<ProgramSessionProps> {
    return { ...this.props };
  }
}
