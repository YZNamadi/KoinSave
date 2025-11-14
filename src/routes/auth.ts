import { Router, Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { register, login } from '../services/authService';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await register(parsed.email, parsed.password);
    res.status(201).json({ success: true, data: user });
  } catch (e) { next(e); }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const token = await login(parsed.email, parsed.password);
    res.json({ success: true, data: token });
  } catch (e) { next(e); }
});

export default router;