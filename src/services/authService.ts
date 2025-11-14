import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { config } from '../config';

export async function register(email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err: any = new Error('Email already registered');
    err.status = 400; err.code = 'EMAIL_TAKEN';
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash: hash, balance: 100000 } });
  return { id: user.id, email: user.email, balance: user.balance };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err: any = new Error('Invalid credentials');
    err.status = 401; err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    const err: any = new Error('Invalid credentials');
    err.status = 401; err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
  return { token };
}