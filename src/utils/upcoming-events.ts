import { planningNotices, todayKey } from './planning-notices.ts'

export type EventApplication = { id: number; company: string; position: string; status: string; dateApplied?: string | null; applicationDeadline?: string | null; followUpDate?: string | null };

export function upcomingEvents(applications: readonly EventApplication[], today = todayKey()) {
  const events = applications.flatMap(application => {
    if (!Number.isInteger(application.id) || application.id <= 0) return []
    return planningNotices(application, today).flatMap(notice => {
      const date = notice.kind === 'deadline' ? application.applicationDeadline : application.followUpDate
      if (!date) return []
      return [{
        id: application.id, company: application.company, position: application.position,
        date, kind: notice.kind, label: notice.label, tone: notice.tone
      }]
    })
  }).sort((first, second) => first.date.localeCompare(second.date) || first.id - second.id)
  return {
    attention: events.filter(event => event.date <= today),
    upcoming: events.filter(event => event.date > today)
  }
}
