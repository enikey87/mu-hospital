import assert from 'node:assert/strict';
import { test } from 'node:test';
import { quantity } from '../src/format.ts';
test('русские числительные учитывают окончания и исключение 11–14', () => {
  const expected = [
    [0, '0 дней'], [1, '1 день'], [2, '2 дня'], [4, '4 дня'],
    [5, '5 дней'], [11, '11 дней'], [12, '12 дней'], [14, '14 дней'],
    [21, '21 день'], [22, '22 дня'], [25, '25 дней'], [101, '101 день'],
  ];
  for (const [value, text] of expected) {
    assert.equal(quantity(value, ['день', 'дня', 'дней']), text);
  }
});
