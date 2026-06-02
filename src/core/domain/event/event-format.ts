export enum EventFormat {
  Presential = "PRESENTIAL",
  Online = "ONLINE",
  Hybrid = "HYBRID",
}

export const EVENT_FORMAT_LABEL: Record<EventFormat, string> = {
  [EventFormat.Presential]: "Presencial",
  [EventFormat.Online]: "Online",
  [EventFormat.Hybrid]: "Híbrido",
};
