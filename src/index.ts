import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { logger } from './middleware/logger';
import { defaultRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import transactionRoutes from './routes/transactions';
import { mountSwagger } from './swagger';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);
app.use(defaultRateLimiter);

mountSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/health', (_, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});