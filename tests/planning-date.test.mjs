import assert from 'node:assert/strict';
import test from 'node:test';
import { isValidPlanningDate } from '../src/utils/planning-date.ts';

test('optional date permits clearing and calendar dates including leap day', () => {
  for (const value of ['', '2024-02-29', '2026-11-30', '0001-01-01', '9999-12-31']) assert.equal(isValidPlanningDate(value), true, value);
});
test('rejects impossible dates, time components and incomplete input', () => {
  for (const value of ['2026-02-29', '2026-02-30', '2026-13-01', '2026-00-01', '2026-11-00', '0000-01-01', '26-11-01', '2026-11-1', '2026-11-01T12:00:00Z', ' ']) assert.equal(isValidPlanningDate(value), false, value);
});
