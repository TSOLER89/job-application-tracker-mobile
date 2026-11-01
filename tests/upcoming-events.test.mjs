import assert from 'node:assert/strict';
import test from 'node:test';
import { upcomingEvents } from '../src/utils/upcoming-events.ts';
const today = '2026-11-15';
const job = (id, status, date) => ({ id, company: 'Company ' + id, position: 'Developer', status, applicationDeadline: date, followUpDate: date });

test('groups past and today separately from future, sorting by date then id', () => {
  const result = upcomingEvents([
    job(6, 'Ansökt', '2026-11-20'), job(5, 'Intresserad', '2026-11-16'),
    job(4, 'Intervju', today), job(3, 'Ansökt', '2026-11-14'),
    job(2, 'Intresserad', '2026-11-16'), job(1, 'Intresserad', '2026-11-13')
  ], today);
  assert.deepEqual(result.attention.map(event => event.id), [1, 3, 4]);
  assert.deepEqual(result.upcoming.map(event => event.id), [2, 5, 6]);
});
test('uses only the relevant date for each active status', () => {
  const result = upcomingEvents([
    { ...job(1, 'Intresserad', today), followUpDate: '2026-11-30' },
    { ...job(2, 'Ansökt', today), applicationDeadline: '2026-11-01', followUpDate: '2026-11-18' },
    job(3, 'Intervju', today), job(4, 'Erbjudande', today), job(5, 'Avslag', today)
  ], today);
  assert.deepEqual(result.attention.map(event => [event.id, event.kind]), [[1, 'deadline'], [3, 'followUp']]);
  assert.deepEqual(result.upcoming.map(event => [event.id, event.kind]), [[2, 'followUp']]);
  assert.equal(result.attention[0].label, 'Sista ansökningsdag idag');
});
test('retains company, position, date and id for an exact application link', () => {
  const event = upcomingEvents([job(42, 'Intervju', '2026-11-18')], today).upcoming[0];
  assert.equal(event.id, 42);
  assert.equal(event.company, 'Company 42');
  assert.equal(event.position, 'Developer');
  assert.equal(event.date, '2026-11-18');
  assert.equal(event.label, 'Uppföljning om 3 dagar');
});
test('ignores invalid dates, absent dates, unknown status and invalid application ids', () => {
  const result = upcomingEvents([
    job(1, 'Ansökt', null), job(2, 'Intresserad', '2026-02-30'),
    job(3, 'Unknown', today), job(0, 'Ansökt', today), job(-1, 'Intresserad', today)
  ], today);
  assert.deepEqual(result, { attention: [], upcoming: [] });
});
test('midnight moves upcoming items to attention and status/date edits remove obsolete items', () => {
  const records = [job(1, 'Ansökt', '2026-11-16')];
  assert.equal(upcomingEvents(records, today).upcoming.length, 1);
  assert.equal(upcomingEvents(records, '2026-11-16').attention.length, 1);
  assert.deepEqual(upcomingEvents([{ ...records[0], status: 'Avslag' }], today), { attention: [], upcoming: [] });
  assert.deepEqual(upcomingEvents([{ ...records[0], followUpDate: null }], today), { attention: [], upcoming: [] });
});
test('keeps all events for expansion and does not mutate the source list', () => {
  const records = Object.freeze(Array.from({ length: 8 }, (_, index) => Object.freeze(job(index + 1, 'Ansökt', '2026-11-20'))));
  const result = upcomingEvents(records, today);
  assert.equal(result.upcoming.length, 8);
  assert.equal(records[0].id, 1);
});
test('handles empty lists, invalid today and year transitions', () => {
  assert.deepEqual(upcomingEvents([], today), { attention: [], upcoming: [] });
  assert.deepEqual(upcomingEvents([job(1, 'Ansökt', today)], 'invalid'), { attention: [], upcoming: [] });
  assert.equal(upcomingEvents([job(1, 'Intresserad', '2027-01-01')], '2026-12-31').upcoming[0].label, 'Sista ansökningsdag imorgon');
});
