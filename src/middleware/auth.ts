import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthPayload { userId: number; email: string }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } });
  }
  const token = header.substring('Bearer '.length);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    (req as any).user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, error: { message: 'Invalid token', code: 'INVALID_TOKEN' } });
  }
}