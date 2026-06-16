import type { CalendarDateView } from "@/core/domain/calendar/calendar-date.repository";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const COLOR_MAP: Record<string, string> = {
  purple: "#703cc0",
  blue: "#267ce8",
  green: "#22c55e",
  red: "#ef4444",
  orange: "#ea580c",
  turquoise: "#00c2d1",
};

const COLOR_BG_MAP: Record<string, string> = {
  purple: "#ede4fb",
  blue: "#dbeafe",
  green: "#dcfce7",
  red: "#fee2e2",
  orange: "#ffedd5",
  turquoise: "#cdf6f9",
};

interface Props {
  dates: CalendarDateView[];
  year: number;
  month: number; // 1-12
}

export function CalendarWidget({ dates, year, month }: Props) {
  const monthName = MESES[month - 1];
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Dom
  const daysInMonth = new Date(year, month, 0).getDate();

  // Map day => list of dates
  const byDay = new Map<number, CalendarDateView[]>();
  for (const d of dates) {
    const day = d.date.getDate();
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(d);
  }

  // Build grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDay = today.getDate();

  return (
    <div className="cal-widget">
      <div className="cal-header">
        <div className="cal-month-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>
            {monthName} {year}
          </span>
        </div>
        <span className="cal-badge-count">
          {dates.length} {dates.length === 1 ? "data" : "datas"}
        </span>
      </div>

      <div className="cal-grid">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} className="cal-cell cal-cell--empty" />;
          const dayDates = byDay.get(day) ?? [];
          const hasDate = dayDates.length > 0;
          const isToday = isCurrentMonth && day === todayDay;
          return (
            <div
              key={day}
              className={[
                "cal-cell",
                hasDate ? "cal-cell--marked" : "",
                isToday ? "cal-cell--today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              title={hasDate ? dayDates.map((d) => d.title).join(", ") : undefined}
            >
              <span className="cal-day-num">{day}</span>
              {hasDate && (
                <div className="cal-dots">
                  {dayDates.slice(0, 3).map((d) => (
                    <span
                      key={d.id}
                      className="cal-dot"
                      style={{ background: COLOR_MAP[d.color] ?? COLOR_MAP.purple }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {dates.length > 0 && (
        <div className="cal-list">
          {dates.map((d) => {
            const day = d.date.getDate();
            const color = COLOR_MAP[d.color] ?? COLOR_MAP.purple;
            const bg = COLOR_BG_MAP[d.color] ?? COLOR_BG_MAP.purple;
            return (
              <div key={d.id} className="cal-item">
                <span className="cal-item-day" style={{ background: bg, color }}>
                  {String(day).padStart(2, "0")}
                </span>
                <div className="cal-item-info">
                  <span className="cal-item-title">{d.title}</span>
                  {d.description && <span className="cal-item-desc">{d.description}</span>}
                </div>
                <span className="cal-item-dot" style={{ background: color }} />
              </div>
            );
          })}
        </div>
      )}

      {dates.length === 0 && (
        <p className="cal-empty">Nenhuma data comemorativa este mês.</p>
      )}
    </div>
  );
}
