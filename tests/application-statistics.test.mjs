import assert from 'node:assert/strict'
import test from 'node:test'
import { applicationStatistics } from '../src/utils/application-statistics.ts'
const today = new Date(2026, 0, 15)
test('counts current statuses independently of dates, and leaves input unchanged', () => {
  const records = ['Intresserad', 'Ansökt', 'Intervju', 'Erbjudande', 'Avslag'].map(status => Object.freeze({ status, dateApplied: null }))
  const stats = applicationStatistics(Object.freeze(records), today)
  assert.equal(stats.total, 5)
  assert.deepEqual(Object.values(stats.counts), [1, 1, 1, 1, 1])
  assert.equal(stats.undated, 4)
})
test('groups six calendar months across a year boundary and counts changed statuses by application date', () => {
  const stats = applicationStatistics([
    { status: 'Intervju', dateApplied: '2025-12-31' },
    { status: 'Avslag', dateApplied: '2026-01-01' },
    { status: 'Erbjudande', dateApplied: '2026-01-15' },
    { status: 'Ansökt', dateApplied: '2025-08-01' },
    { status: 'Ansökt', dateApplied: '2025-07-31' },
    { status: 'Intresserad', dateApplied: '2026-01-10' },
  ], today)
  assert.deepEqual(stats.months.map(month => month.key), ['2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01'])
  assert.deepEqual(stats.months.map(month => month.count), [1, 0, 0, 0, 1, 2])
  assert.equal(stats.thisMonth, 2)
  assert.equal(stats.previousMonth, 1)
  assert.equal(stats.maximum, 2)
})
test('rejects invalid calendar dates and separates future dates', () => {
  const stats = applicationStatistics([null, '', '2025-02-29', '2026-02-30', '2026-13-01', '2026-01-00', 'invalid', '2026-01-01T00:00:00Z', '2026-01-16'].map(dateApplied => ({ status: 'Ansökt', dateApplied })), today)
  assert.equal(stats.undated, 8)
  assert.equal(stats.future, 1)
  assert.equal(stats.thisMonth, 0)
})
test('accepts leap day and local calendar dates without UTC conversion', () => {
  const stats = applicationStatistics([{ status: 'Ansökt', dateApplied: '2024-02-29' }, { status: 'Intervju', dateApplied: '2024-03-01' }], new Date(2024, 2, 1))
  assert.equal(stats.previousMonth, 1)
  assert.equal(stats.thisMonth, 1)
  assert.equal(stats.undated, 0)
})
test('empty data has six zero months and a safe chart maximum', () => {
  const stats = applicationStatistics([], today)
  assert.equal(stats.total, 0)
  assert.equal(stats.maximum, 1)
  assert.ok(stats.months.every(month => month.count === 0))
})
test('editing dates and removing applications updates the totals and monthly buckets', () => {
  const records = [{ status: 'Ansökt', dateApplied: '2025-12-01' }, { status: 'Intervju', dateApplied: '2026-01-01' }]
  assert.equal(applicationStatistics(records, today).thisMonth, 1)
  const edited = records.map(record => ({ ...record, dateApplied: '2026-01-02' }))
  assert.equal(applicationStatistics(edited, today).thisMonth, 2)
  assert.equal(applicationStatistics(edited.slice(1), today).total, 1)
})
