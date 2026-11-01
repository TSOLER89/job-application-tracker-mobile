export type PlanningApplication = { status: string; applicationDeadline?: string | null; followUpDate?: string | null };
export type PlanningNotice = { kind: 'deadline' | 'followUp'; tone: 'urgent' | 'warning' | 'neutral'; label: string };

export function todayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// Compare calendar days in UTC after reading the user's local date.
// This avoids a 23/25-hour day around daylight-saving changes.
function calendarDay(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  if (year < 1) return null
  const date = new Date(0)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCFullYear(year, month - 1, day)
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null
  return date.getTime() / 86400000
}

export function planningNotices(application: PlanningApplication, today = todayKey()): PlanningNotice[] {
  const current = calendarDay(today)
  if (current === null) return []
  if (application.status === 'Intresserad') {
    const deadline = calendarDay(application.applicationDeadline)
    if (deadline === null) return []
    const days = deadline - current
    const label = days < 0 ? 'Sista ansökningsdagen har passerat'
      : days === 0 ? 'Sista ansökningsdag idag'
      : days === 1 ? 'Sista ansökningsdag imorgon'
      : `${days} dagar kvar till sista ansökningsdag`
    return [{ kind: 'deadline', tone: days <= 0 ? 'urgent' : days <= 3 ? 'warning' : 'neutral', label }]
  }
  if (application.status === 'Ansökt' || application.status === 'Intervju') {
    const followUp = calendarDay(application.followUpDate)
    if (followUp === null) return []
    const days = followUp - current
    const label = days < 0 ? `Uppföljning försenad med ${-days} ${days === -1 ? 'dag' : 'dagar'}`
      : days === 0 ? 'Dags att följa upp'
      : days === 1 ? 'Uppföljning imorgon'
      : `Uppföljning om ${days} dagar`
    return [{ kind: 'followUp', tone: days <= 0 ? 'urgent' : days <= 3 ? 'warning' : 'neutral', label }]
  }
  return []
}
