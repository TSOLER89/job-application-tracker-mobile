export type StatisticsApplication = { status: string; dateApplied?: string | null };

export const STATUSES = ['Intresserad', 'Ansökt', 'Intervju', 'Erbjudande', 'Avslag']

// DateOnly values stay as calendar dates: no UTC conversion or timezone shift.
export function applicationStatistics(applications: readonly StatisticsApplication[], today = new Date()) {
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const counts = Object.fromEntries(STATUSES.map(status => [status, 0]))
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(year, month - 5 + index, 1)
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('sv-SE', { month: 'short', year: 'numeric' }),
      count: 0
    }
  })
  let undated = 0
  let future = 0
  for (const application of applications) {
    if (Object.hasOwn(counts, application.status)) counts[application.status]++
    if (application.status === 'Intresserad') continue
    const value = application.dateApplied
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) { undated++; continue }
    const [y, m, d] = value.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) { undated++; continue }
    if (value > todayKey) { future++; continue }
    const bucket = months.find(entry => entry.key === value.slice(0, 7))
    if (bucket) bucket.count++
  }
  return {
    total: applications.length, counts, months, undated, future,
    thisMonth: months[5].count, previousMonth: months[4].count,
    maximum: Math.max(1, ...months.map(entry => entry.count))
  }
}
