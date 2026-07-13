const EPSILON = 0.001;

function normalizeValue(v) {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number') return Math.round(v / EPSILON) * EPSILON;
  return v;
}

function normalizeRow(row) {
  // Sort values within a row so column order doesn't matter for comparison
  return row.map(normalizeValue).slice().sort((a, b) => {
    if (a === null) return -1;
    if (b === null) return 1;
    return String(a).localeCompare(String(b));
  });
}

function rowsEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((val, i) => {
    if (typeof val === 'number' && typeof b[i] === 'number') {
      return Math.abs(val - b[i]) < EPSILON;
    }
    return val === b[i];
  });
}

export function checkAnswer(userResult, expectedRows) {
  const userRows = userResult.rows.map(normalizeRow);
  const expected = expectedRows.map((row) => normalizeRow(row));

  if (userRows.length !== expected.length) return false;

  // Row order doesn't matter either — match each expected row to some user row
  const remaining = [...userRows];
  for (const expRow of expected) {
    const idx = remaining.findIndex((r) => rowsEqual(r, expRow));
    if (idx === -1) return false;
    remaining.splice(idx, 1);
  }
  return true;
}
