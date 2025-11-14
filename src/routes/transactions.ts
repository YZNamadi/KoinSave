import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth';
import { transferSchema } from '../validators/transactionValidators';
import { listTransactions, transfer } from '../services/transactionService';

const router = Router();

router.post('/transfer', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = transferSchema.parse(req.body);
    const userId = (req as any).user.userId as number;
    const tx = await transfer(userId, parsed.toUserId, parsed.amount);
    res.status(201).json({ success: true, data: tx });
  } catch (e) { next(e); }
});

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId as number;
    const txs = await listTransactions(userId);
    res.json({ success: true, data: txs });
  } catch (e) { next(e); }
});

export default router;