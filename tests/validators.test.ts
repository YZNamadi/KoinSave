import { registerSchema } from '../src/validators/authValidators';
import { transferSchema } from '../src/validators/transactionValidators';

describe('Validation Schemas', () => {
  test('registerSchema accepts valid payload', () => {
    const parsed = registerSchema.parse({ email: 'test@example.com', password: 'password123' });
    expect(parsed.email).toBe('test@example.com');
  });

  test('registerSchema rejects invalid email', () => {
    expect(() => registerSchema.parse({ email: 'bad', password: 'password123' })).toThrow();
  });

  test('transferSchema accepts valid payload', () => {
    const parsed = transferSchema.parse({ toUserId: 1, amount: 10 });
    expect(parsed.amount).toBe(10);
  });

  test('transferSchema rejects negative amount', () => {
    expect(() => transferSchema.parse({ toUserId: 1, amount: -5 })).toThrow();
  });
});