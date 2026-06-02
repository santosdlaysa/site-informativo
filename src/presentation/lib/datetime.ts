/** Converte "dd/mm/aaaa" + "hh:mm" em Date local. Retorna null se inválido. */
export function parseDateTime(dateStr: string, timeStr?: string): Date | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr.trim());
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  let hh = 0;
  let min = 0;
  if (timeStr && timeStr.trim()) {
    const t = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
    if (!t) return null;
    hh = Number(t[1]);
    min = Number(t[2]);
  }
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd), hh, min);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "20/05" (dia/mês) para chips e tags compactas. */
export function dayMonth(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${d}/${m}`;
}

const MESES_ABBR = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function dayAndMonthAbbr(date: Date): { day: string; month: string } {
  return { day: String(date.getDate()).padStart(2, "0"), month: MESES_ABBR[date.getMonth()] ?? "" };
}

/** "10:00" */
export function hourMinute(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}
