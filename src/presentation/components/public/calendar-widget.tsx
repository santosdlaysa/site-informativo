import type { CalendarDateView } from "@/core/domain/calendar/calendar-date.repository";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface Props {
  dates: CalendarDateView[];
  year: number;
  month: number;
  variant?: "sidebar" | "section";
}

function CalendarGrid({ dates, year, month }: { dates: CalendarDateView[]; year: number; month: number }) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const byDay = new Map<number, CalendarDateView[]>();
  for (const d of dates) {
    const day = d.date.getDate();
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(d);
  }

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDay = today.getDate();

  return (
    <div className="cal-grid">
      {DIAS_SEMANA.map((d) => (
        <div key={d} className="cal-dow">{d}</div>
      ))}
      {cells.map((day, i) => {
        if (day === null) return <div key={`e-${i}`} className="cal-cell cal-cell--empty" />;
        const dayDates = byDay.get(day) ?? [];
        const hasDate = dayDates.length > 0;
        const isToday = isCurrentMonth && day === todayDay;
        const tooltip = hasDate ? dayDates.map((d) => `• ${d.title}`).join("\n") : undefined;
        return (
          <div
            key={day}
            className={["cal-cell", hasDate ? "cal-cell--marked" : "", isToday ? "cal-cell--today" : ""].filter(Boolean).join(" ")}
            data-tooltip={tooltip}
          >
            <span className="cal-day-num">{day}</span>
            {hasDate && <span className="cal-dot" />}
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ section }: { section?: boolean }) {
  return (
    <div className={section ? "cal-empty-state cal-empty-state--section" : "cal-empty-state"}>
      <span className="cal-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </span>
      <div>
        <p className="cal-empty-title">Nenhuma data comemorativa este mês.</p>
        <p className="cal-empty-sub">Confira outros meses no calendário.</p>
      </div>
    </div>
  );
}

export function CalendarWidget({ dates, year, month, variant = "sidebar" }: Props) {
  const monthName = MESES[month - 1];

  if (variant === "section") {
    return (
      <div className="cal-section">
        <div className="cal-section-head">
          <div className="cal-month-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Calendário Comemorativo — {monthName} {year}</span>
          </div>
          <span className="cal-badge-count">
            {dates.length} {dates.length === 1 ? "data" : "datas"}
          </span>
        </div>
        {dates.length === 0 ? <EmptyState section /> : <CalendarGrid dates={dates} year={year} month={month} />}
      </div>
    );
  }

  return (
    <div className="cal-widget">
      <div className="cal-header">
        <div className="cal-month-label">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span>{monthName} {year}</span>
        </div>
        <span className="cal-badge-count">
          {dates.length} {dates.length === 1 ? "data" : "datas"}
        </span>
      </div>
      {dates.length === 0 ? <EmptyState /> : <CalendarGrid dates={dates} year={year} month={month} />}
    </div>
  );
}
