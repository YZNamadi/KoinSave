import { z } from 'zod';

export const transferSchema = z.object({
  toUserId: z.number().int().positive(),
  amount: z.number().positive(),
});