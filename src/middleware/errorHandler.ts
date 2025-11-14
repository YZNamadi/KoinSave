import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // Zod validation errors
  if (err instanceof ZodError) {
    const rawIssues: any[] = (err as any).issues ?? (err as any).errors ?? [];
    const details = rawIssues.map((issue: any) => ({
      path: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? ''),
      message: issue.message,
      code: issue.code,
    }));
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details },
    });
  }

  // JWT errors
  if (err?.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
  }
  if (err?.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } });
  }

  const status = err?.status ?? 500;
  const code = err?.code ?? (status >= 500 ? 'INTERNAL_ERROR' : 'ERROR');
  const message = err?.message ?? (status >= 500 ? 'Internal Server Error' : 'Request error');

  return res.status(status).json({ success: false, error: { code, message } });
}