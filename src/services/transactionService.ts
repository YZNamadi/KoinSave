import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import { toCents } from '../utils/money';

export function validateSufficientBalance(currentBalanceCents: number, amountCents: number) {
  if (amountCents <= 0) {
    const err: any = new Error('Amount must be positive');
    err.status = 400; err.code = 'INVALID_AMOUNT';
    throw err;
  }
  if (currentBalanceCents < amountCents) {
    const err: any = new Error('Insufficient balance');
    err.status = 400; err.code = 'INSUFFICIENT_FUNDS';
    throw err;
  }
}

export async function transfer(fromUserId: number, toUserId: number, amount: number) {
  if (fromUserId === toUserId) {
    const err: any = new Error('Cannot transfer to self');
    err.status = 400; err.code = 'SELF_TRANSFER';
    throw err;
  }
  const amountCents = toCents(amount);
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const from = await tx.user.findUnique({ where: { id: fromUserId } });
    const to = await tx.user.findUnique({ where: { id: toUserId } });
    if (!from || !to) {
      const err: any = new Error('User not found');
      err.status = 404; err.code = 'USER_NOT_FOUND';
      throw err;
    }
    validateSufficientBalance(from.balance, amountCents);

    await tx.user.update({ where: { id: from.id }, data: { balance: { decrement: amountCents } } });
    await tx.user.update({ where: { id: to.id }, data: { balance: { increment: amountCents } } });
    const txRecord = await tx.transaction.create({
      data: { amount: amountCents, fromUserId: from.id, toUserId: to.id },
    });
    return txRecord;
  });
}

export async function listTransactions(userId: number) {
  return prisma.transaction.findMany({
    where: { OR: [{ fromUserId: userId }, { toUserId: userId }] },
    orderBy: { createdAt: 'desc' },
  });
}