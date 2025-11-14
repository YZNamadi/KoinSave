import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  rateLimitWindowMs: 15 * 60 * 1000,
  rateLimitMax: 100,
};

if (!process.env.JWT_SECRET) {
  // Warn in dev; in production, enforce via deployment config
  console.warn('Warning: JWT_SECRET not set. Using a development fallback.');
}