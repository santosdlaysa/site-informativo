export enum SessionStatus {
  Scheduled = "SCHEDULED",
  Live = "LIVE",
  Finished = "FINISHED",
}

export const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  [SessionStatus.Scheduled]: "Agendada",
  [SessionStatus.Live]: "Ao vivo",
  [SessionStatus.Finished]: "Encerrada",
};
