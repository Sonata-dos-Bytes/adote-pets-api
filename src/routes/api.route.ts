import { home } from '@controllers/app.controller';
import { Router } from 'express';
import authRouter from './auth/auth.route';

const router = Router();

router.get('/', home);

router.use('/auth', authRouter);

export default router;
