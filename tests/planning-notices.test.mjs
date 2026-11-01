import assert from 'node:assert/strict';
import test from 'node:test';
import { planningNotices, todayKey } from '../src/utils/planning-notices.ts';
const today = '2026-11-15';
const interested = (date, status = 'Intresserad') => ({ status, applicationDeadline: date });
const applied = (date, status = 'Ansökt') => ({ status, followUpDate: date });

test('deadline distinguishes past, today, tomorrow and three-day warning', () => {
  assert.match(planningNotices(interested('2026-11-14'), today)[0].label, /passerat/);
  assert.equal(planningNotices(interested(today), today)[0].label, 'Sista ansökningsdag idag');
  assert.equal(planningNotices(interested('2026-11-16'), today)[0].label, 'Sista ansökningsdag imorgon');
  assert.deepEqual(planningNotices(interested('2026-11-18'), today)[0], { kind: 'deadline', tone: 'warning', label: '3 dagar kvar till sista ansökningsdag' });
  assert.equal(planningNotices(interested('2026-11-19'), today)[0].tone, 'neutral');
});
test('submitted applications never get a missed-deadline warning', () => {
  for (const status of ['Ansökt', 'Intervju', 'Erbjudande', 'Avslag']) assert.deepEqual(planningNotices(interested('2026-11-01', status), today), []);
});
test('follow-up distinguishes due, overdue and upcoming without changing dates', () => {
  assert.equal(planningNotices(applied(today), today)[0].label, 'Dags att följa upp');
  assert.equal(planningNotices(applied('2026-11-14'), today)[0].label, 'Uppföljning försenad med 1 dag');
  assert.equal(planningNotices(applied('2026-11-13'), today)[0].label, 'Uppföljning försenad med 2 dagar');
  assert.equal(planningNotices(applied('2026-11-16'), today)[0].label, 'Uppföljning imorgon');
  assert.equal(planningNotices(applied('2026-11-18', 'Intervju'), today)[0].label, 'Uppföljning om 3 dagar');
  const record = Object.freeze(applied('2026-11-20'));
  assert.equal(planningNotices(record, today)[0].tone, 'neutral');
  assert.equal(record.followUpDate, '2026-11-20');
});
test('interested and closed jobs do not trigger follow-up prompts', () => {
  for (const status of ['Intresserad', 'Erbjudande', 'Avslag', 'Unknown']) assert.deepEqual(planningNotices(applied(today, status), today), []);
});
test('missing, removed or malformed dates produce no misleading notices', () => {
  for (const value of [null, undefined, '', '2026-02-30', '2026-13-01', '2026-00-01', '0000-01-01', '2026-11-15T00:00:00Z']) {
    assert.deepEqual(planningNotices(interested(value), today), []);
    assert.deepEqual(planningNotices(applied(value), today), []);
  }
});
test('calendar differences cross daylight-saving, leap-day and year boundaries', () => {
  for (const [from, to, days] of [['2026-03-29', '2026-03-30', 1], ['2026-10-25', '2026-10-26', 1], ['2024-02-28', '2024-03-01', 2], ['2026-12-31', '2027-01-01', 1]]) {
    const notice = planningNotices(interested(to), from)[0];
    assert.equal(notice.label, days === 1 ? 'Sista ansökningsdag imorgon' : '2 dagar kvar till sista ansökningsdag');
  }
});
test('status changes and clearing dates immediately remove obsolete prompts', () => {
  const record = { status: 'Intresserad', applicationDeadline: today, followUpDate: today };
  assert.equal(planningNotices(record, today)[0].kind, 'deadline');
  assert.equal(planningNotices({ ...record, status: 'Ansökt' }, today)[0].kind, 'followUp');
  assert.deepEqual(planningNotices({ ...record, status: 'Avslag' }, today), []);
  assert.deepEqual(planningNotices({ ...record, applicationDeadline: null }, today), []);
});
test('today key uses local calendar components rather than an ISO UTC date', () => {
  assert.equal(todayKey(new Date(2026, 10, 15, 0, 15)), today);
  assert.deepEqual(planningNotices(interested(today), 'invalid'), []);
});
