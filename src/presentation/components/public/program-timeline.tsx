"use client";

import { useState } from "react";
import { badgeClass } from "@/presentation/lib/category-variant";

export interface SlotVM {
  id: string;
  hr: string;
  dur: string;
  live: boolean;
  categoryName: string | null;
  categoryVariant: string | null;
  title: string;
  description: string | null;
  speaker: string | null;
  speakerRole: string | null;
  joinLink: string | null;
}

export interface DayVM {
  key: string;
  dow: string;
  dnum: string;
  month: string;
  year: string;
  sessions: SlotVM[];
}

export function ProgramTimeline({ days }: { days: DayVM[] }) {
  const [active, setActive] = useState(0);

  if (days.length === 0) {
    return <div className="empty-state">Nenhuma sessão na agenda por enquanto.</div>;
  }

  const current = days[active] ?? days[0]!;

  return (
    <>
      <div className="day-tabs">
        {days.map((d, i) => (
          <button
            key={d.key}
            className={`day-tab${i === active ? " active" : ""}`}
            onClick={() => setActive(i)}
          >
            <span className="dow">{d.dow}</span>
            <span className="dnum">{d.dnum}</span>
            <span className="dyr">{d.month} {d.year}</span>
          </button>
        ))}
      </div>

      <div className="day-panel active">
        <div className="timeline">
          {current.sessions.map((s) => (
            <article className={`slot${s.live ? " live" : ""}`} key={s.id}>
              <div className="slot-time">
                <span className="hr">{s.hr}</span>
                <span className="dur">{s.dur}</span>
                {s.live && (
                  <span className="live-pill">
                    <span className="blink" />
                    Ao vivo
                  </span>
                )}
              </div>
              <div className="slot-body">
                {s.categoryName && (
                  <div className="top">
                    <span className={badgeClass(s.categoryVariant ?? undefined, { soft: true })}>
                      {s.categoryName}
                    </span>
                  </div>
                )}
                <h3>{s.title}</h3>
                {s.description && <p>{s.description}</p>}
                <div className="speaker">
                  <div>
                    <div className="nm">{s.speaker ?? "A definir"}</div>
                    {s.speakerRole && <div className="rl">{s.speakerRole}</div>}
                  </div>
                  {s.live && s.joinLink && (
                    <a className="btn-join" href={s.joinLink} target="_blank" rel="noreferrer">
                      Entrar na live
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
