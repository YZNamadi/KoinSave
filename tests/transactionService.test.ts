import { validateSufficientBalance } from '../src/services/transactionService';

describe('Transaction service validations', () => {
  test('throws on insufficient funds', () => {
    expect(() => validateSufficientBalance(100, 200)).toThrow();
  });

  test('allows valid amount', () => {
    expect(() => validateSufficientBalance(1000, 200)).not.toThrow();
  });

  test('throws on non-positive amount', () => {
    expect(() => validateSufficientBalance(1000, 0)).toThrow();
  });
});