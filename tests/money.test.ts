import { toCents, fromCents } from '../src/utils/money';

describe('Money utils', () => {
  test('toCents converts dollars to integer cents', () => {
    expect(toCents(10)).toBe(1000);
    expect(toCents(0.01)).toBe(1);
  });

  test('fromCents converts cents to dollars', () => {
    expect(fromCents(1000)).toBe(10);
    expect(fromCents(1)).toBe(0.01);
  });
});