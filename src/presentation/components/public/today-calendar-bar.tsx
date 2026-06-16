import type { CalendarDateView } from "@/core/domain/calendar/calendar-date.repository";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function TodayCalendarBar({ dates, today }: { dates: CalendarDateView[]; today: Date }) {
  const todayDates = dates.filter((d) => {
    const dd = d.date instanceof Date ? d.date : new Date(d.date);
    return dd.getDate() === today.getDate() && dd.getMonth() === today.getMonth();
  });

  const dateLabel = `${today.getDate()} de ${MESES[today.getMonth()]} de ${today.getFullYear()}`;

  if (todayDates.length === 0) {
    return (
      <div className="today-bar-card">
        <span className="today-bar-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </span>
        <div className="today-bar-text">
          <span className="today-bar-title">Não há datas comemorativas hoje.</span>
          <span className="today-bar-sub">{dateLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={todayDates.length > 4 ? "today-cards-wrap today-cards-wrap--scroll" : "today-cards-wrap"}>
      {todayDates.map((d) => (
        <div key={d.id} className="today-bar-card">
          <span className="today-bar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={18} height={18}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          <div className="today-bar-text">
            <span className="today-bar-title">{d.title}</span>
            <span className="today-bar-sub">{dateLabel}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
