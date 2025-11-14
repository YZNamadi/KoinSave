import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { prisma } from '../services/prisma';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = (req as any).user.userId as number;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found', code: 'USER_NOT_FOUND' } });
    res.json({ success: true, data: { id: user.id, email: user.email, balance: user.balance } });
  } catch (e) { next(e); }
});

export default router;